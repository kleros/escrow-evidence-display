import axios from 'axios'
import React, { Component } from 'react'
import styled from 'styled-components/macro'
import Web3 from 'web3'

import FundsGraph from '../components/funds-graph'
import SettlementHistory from '../components/settlement-history'
import EscrowContract from '../assets/contracts/escrow.json'

const web3 = new Web3(window.web3 ? (window.web3.currentProvider || 'https://mainnet.infura.io/v3/668b3268d5b241b5bab5c6cb886e4c61') : 'https://mainnet.infura.io/v3/668b3268d5b241b5bab5c6cb886e4c61')
// Global CSS
const EscrowEvidence = styled.div`
  margin: 0;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.65);
  background-color: #fff;
`

const getTotalAmount = (_amountArray) => {
  if (_amountArray.length === 0) return 0
  if (_amountArray.length === 1) return _amountArray[0].amount
  return _amountArray.reduce((a, b) => Number(a.amount) + Number(b.amount))
}

class EscrowDisplay extends Component {
  state = { transaction: null }

  async componentDidMount() {
    if (window.location.search[0] !== '?') return
    const message = JSON.parse(
      window.location.search
        .substring(1)
        .replace(/%22/g, '"')
        .replace(/%7B/g, '{')
        .replace(/%3A/g, ':')
        .replace(/%2C/g, ',')
        .replace(/%7D/g, '}')
    )

    const {
      disputeID,
      arbitrableContractAddress,
      arbitratorContractAddress
    } = message

    if (!arbitrableContractAddress || !disputeID || !arbitratorContractAddress)
      return

    const escrowContractInstance = new web3.eth.Contract(
      EscrowContract.abi,
      arbitrableContractAddress
    )

    const transactionID = await escrowContractInstance.methods.disputeIDtoTransactionID(disputeID).call()

    const transaction = await escrowContractInstance.methods.transactions(transactionID).call()
    transaction.payments = []
    transaction.reimbursements = []

    const paymentEvents = await escrowContractInstance.getPastEvents('Payment', {
      fromBlock: 0,
      toBlock: 'latest',
      filter: {
        _transactionID: transactionID
      }
    })

    const metaEvidenceEvents = await escrowContractInstance.getPastEvents('MetaEvidence', {
      fromBlock: 0,
      toBlock: 'latest',
      filter: {
        _metaEvidenceID: transactionID
      }
    })

    if (metaEvidenceEvents.length < 1)
      throw new Error(`No MetaEvidece for dispute ${disputeID}`)

    const metaEvidenceJSON = await axios.get(metaEvidenceEvents[0].returnValues._evidence.replace(
      /^\/ipfs\//,
      'https://ipfs.kleros.io/ipfs/'
    ))
    transaction.totalAmount = metaEvidenceJSON.data.amount

    for (const eventLog of paymentEvents) {
      const timestamp = (await web3.eth.getBlock(eventLog.blockNumber)).timestamp * 1000
      const direction = eventLog.returnValues._party === transaction.sender ? 'payments' : 'reimbursements'
      transaction[
        direction
      ].push({
        'amount': web3.utils.fromWei(eventLog.returnValues._amount),
        timestamp
      })
    }

    this.setState({ transaction })
  }

  render() {
    const { transaction } = this.state
    if (!transaction) return (<div />)

    const totalPayments = getTotalAmount(transaction.payments)
    const totalReimbursed = getTotalAmount(transaction.reimbursements)

    return (
      <div>
        <EscrowEvidence>
          <FundsGraph totalAmount={transaction.totalAmount} payments={totalPayments} refunded={totalReimbursed} style={{marginBottom: 47}}/>
        </EscrowEvidence>
        <SettlementHistory totalAmount={transaction.totalAmount} payments={transaction.payments} refunded={transaction.reimbursements} />
      </div>
    )
  }
}

export default EscrowDisplay
