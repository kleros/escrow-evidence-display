import React from 'react'
import _ from 'lodash'
import styled from 'styled-components/macro'

const monthAbbr = [
  "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"
]


const SettlementListContainer = styled.div`
  margin-top: 10px;
  font-size: 14px;
  letter-spacing: 0.4px;
`

const ListItem = styled.div`
`

const ListDate = styled.div`
  display: inline-block;
`

const Delimiter = styled.div`
  margin: 0px 10px;
  display: inline-block;
`

const ListText = styled.div`
  display: inline-block;
`

const SettlementList = ({
  settlements,
  denomination
}) => {
  const orderedTransactions = _.sortBy(settlements, 'timestamp', 'asc')

  const elements = []
  for (const tx of orderedTransactions) {
    const txDate = new Date(tx.timestamp)
    elements.push(
      <ListItem>
        <ListDate>
        {`${('0' + txDate.getDate()).slice(-2)} ${monthAbbr[txDate.getMonth()]} ${txDate.getFullYear()}`}
        </ListDate>
        <Delimiter>|</Delimiter>
        <ListText>
          {`The ${tx.side} ${tx.side === 'sender' ? "unlocked" : "waived"} ${tx.amount} ${denomination} (${tx.percentage}% of the total amount)`}
        </ListText>
      </ListItem>
    )
  }

  return (
    <SettlementListContainer>
      {elements}
    </SettlementListContainer>
  )
}

export default SettlementList
