import React from 'react'
import styled from 'styled-components/macro'

import SettlementList from './settlement-list'

const SettlementHistoryContainer = styled.div`
  background: linear-gradient(214.69deg, #FFFFFF -6.48%, #F8F8F8 45.52%);
  font-family: 'Roboto', sans-serif;
  padding-bottom: 47px;
`

const TextContainer = styled.div `
  margin: 0px 30px;
`

const Title = styled.div`
  color: #4D00B4;
  font-size: 14px;
  padding-top: 18px;
`

const SettlementHistory = ({
  totalAmount,
  payments,
  refunded,
  denomination
}) => {
  const allTransactions = []
  for (const payment of payments) {
    const _payment = payment
    _payment.percentage = Math.round((Number(payment.amount) * 100) / Number(totalAmount))
    _payment.side = 'sender'
    allTransactions.push(_payment)
  }
  for (const refund of refunded) {
    const _refund = refund
    _refund.percentage = Math.round((Number(refund.amount) * 100) / Number(totalAmount))
    _refund.side = 'receiver'
    allTransactions.push(_refund)
  }

  if (allTransactions.length === 0) return null

  return (
    <SettlementHistoryContainer>
      <TextContainer>
        <Title>Settlement History</Title>
        <SettlementList settlements={allTransactions} denomination={denomination} />
      </TextContainer>
    </SettlementHistoryContainer>
  )
}

export default SettlementHistory
