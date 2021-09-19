import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Spinner from '../Spinner'
import { loadBalances } from '../../store/actions/wallet'
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

const Balance = ({ dispatch, web3, exchange, token, account, ...props }) => {
  useEffect(() => {
    const loadBlockchainData = async () => {
      await loadBalances(dispatch, web3, exchange, token, account)
    }
    loadBlockchainData()
  }, [dispatch, web3, exchange, token, account])

  return (
    <div className="card bg-dark text-white">
      <div className="card-header">
        Wallet {props.showForm ? null : <Spinner />}
      </div>
      <div className="card-body">
        <BalanceForm
          dispatch={dispatch}
          web3={web3}
          exchange={exchange}
          token={token}
          account={account}
          {...props}
        />
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

// function mapDispatchToProps(dispatch) {
//   return { dispatch: (p) => dispatch(p) }
// }

export default connect(mapStateToProps)(Balance)
