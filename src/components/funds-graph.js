import React from 'react'
import styled from 'styled-components/macro'

const StyledBarContainer = styled.div`
  margin: 37px 30px;
`

const StyledBarCol = styled.div`
  display: inline-block;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
`

const StyledBar = styled.div`
  height: 8px;
  border-radius: 3px;
  width: 100%;
`

const PayedAmountBar = styled(StyledBar)`
  background: #009AFF;
  z-index: 1;
`

const LockedAmountBar = styled(StyledBar)`
  background: #F60C36;
  z-index: 2;
`

const ReimbursedAmountBar = styled(StyledBar)`
  background: #4D00B4;
  z-index: 3;
`

const StyledPercentage = styled.div`
  margin-bottom: 5px;
`

const LockedAmountBarContainer = styled(StyledBarCol)`
`

const DoubleOverlap = styled(LockedAmountBarContainer)`
  margin-left: -5px;
  margin-right: -5px;
`

const LeftOverlap = styled(LockedAmountBarContainer)`
  margin-left: -5px;
`

const RightOverlap = styled(LockedAmountBarContainer)`
  margin-right: -5px;
`

const IndexContainer = styled.div`
  margin-top: 35px;
  width: 33%;
  text-align: left;
  display: inline-block;
  position: relative;
`

const IndexText = styled.p`
  display: inline-block;
  font-size: 14px;
  line-height: 19px;
  margin-bottom: 5px;
  position: relative;
  bottom: 3px;
`

const Circle = styled.div`
  border-radius: 50%;
  height: 19px;
  width: 19px;
  display: inline-block;
  margin-right: 15px;
  margin-top: 10px;
  vertical-align: top;
`

const FundsGraph = ({
  totalAmount,
  payments,
  refunded
}) => {
  const payedPercentage = Math.round(Number(payments * 100) / Number(totalAmount))
  const refundedPercentage = Math.round(Number(refunded * 100) / Number(totalAmount))
  const lockedPercentage = 100 - payedPercentage - refundedPercentage

  // make sure we have the correct overlap
  let LockedContainerClass
  if (payedPercentage > 0 && refundedPercentage > 0) LockedContainerClass = DoubleOverlap
  else if (payedPercentage > 0) LockedContainerClass = LeftOverlap
  else if (refundedPercentage > 0) LockedContainerClass = RightOverlap
  else LockedContainerClass = LockedAmountBarContainer

  return (
    <StyledBarContainer>
      <StyledBarCol style={{width: `${payedPercentage}%`, color: "#009AFF", marginLeft: "0px"}}>
        <StyledPercentage>{payedPercentage > 0 ? `${payedPercentage}% - ${payments} ETH` : ''}</StyledPercentage>
        <PayedAmountBar />
      </StyledBarCol>
      <LockedContainerClass style={{width: `${lockedPercentage}%`, color: "#F60C36"}}>
        <StyledPercentage>{lockedPercentage > 0 ? `${lockedPercentage}% - ${Number(totalAmount) - Number(payments) - Number(refunded)} ETH` : ''}</StyledPercentage>
        <LockedAmountBar />
      </LockedContainerClass>
      <StyledBarCol style={{width: `${refundedPercentage}%`, color: "#4D00B4"}}>
        <StyledPercentage>{refundedPercentage > 0 ? `${refundedPercentage}% - ${refunded} ETH` : ''}</StyledPercentage>
        <ReimbursedAmountBar />
      </StyledBarCol>
      <IndexContainer style={{color: "#009AFF"}}>
        <Circle style={{background: "#009AFF"}}/> <IndexText>Amount Unlocked By Sender</IndexText>
      </IndexContainer>
      <IndexContainer style={{color: "#F60C36", textAlign: "center"}}>
        <Circle style={{background: "#F60C36"}}/> <IndexText> Amount in dispute </IndexText>
      </IndexContainer>
      <IndexContainer style={{color: "#4D00B4", textAlign: "right"}}>
        <Circle style={{background: "#4D00B4"}}/> <IndexText> Amount waived by sender </IndexText>
      </IndexContainer>
    </StyledBarContainer>
  )
}

export default FundsGraph
