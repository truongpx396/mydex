import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Spinner from '../Spinner'
import { loadBalances } from '../../store/interactions'
import {
  exchangeSelector,
  tokenSelector,
  accountSelector,
  web3Selector,
} from '../../store/selectors/base'
import {
  etherBalanceSelector,
  tokenBalanceSelector,
  exchangeEtherBalanceSelector,
  exchangeTokenBalanceSelector,
  balancesLoadingSelector,
  etherDepositAmountSelector,
  etherWithdrawAmountSelector,
  tokenDepositAmountSelector,
  tokenWithdrawAmountSelector,
} from '../../store/selectors/wallet'
import BalanceForm from './BalanceForm'

const Balance = (props) => {
  useEffect(() => {
    const loadBlockchainData = async () => {
      const { dispatch, web3, exchange, token, account } = props
      await loadBalances(dispatch, web3, exchange, token, account)
    }
    loadBlockchainData()
  }, [])

  return (
    <div className="card bg-dark text-white">
      <div className="card-header">
        Wallet {props.showForm ? null : <Spinner />}
      </div>
      <div className="card-body">
        <BalanceForm {...props} />
      </div>
    </div>
  )
}

function mapStateToProps(state) {
  const balancesLoading = balancesLoadingSelector(state)

  return {
    account: accountSelector(state),
    exchange: exchangeSelector(state),
    token: tokenSelector(state),
    web3: web3Selector(state),
    etherBalance: etherBalanceSelector(state),
    tokenBalance: tokenBalanceSelector(state),
    exchangeEtherBalance: exchangeEtherBalanceSelector(state),
    exchangeTokenBalance: exchangeTokenBalanceSelector(state),
    balancesLoading,
    showForm: !balancesLoading,
    etherDepositAmount: etherDepositAmountSelector(state),
    etherWithdrawAmount: etherWithdrawAmountSelector(state),
    tokenDepositAmount: tokenDepositAmountSelector(state),
    tokenWithdrawAmount: tokenWithdrawAmountSelector(state),
  }
}

export default connect(mapStateToProps)(Balance)
