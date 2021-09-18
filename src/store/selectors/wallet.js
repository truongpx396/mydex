import { get } from 'lodash'
import { createSelector } from 'reselect'
import { formatBalance } from '../../helpers'

const balancesLoading = (state) => get(state, 'exchange.balancesLoading', true)
export const balancesLoadingSelector = createSelector(
  balancesLoading,
  (status) => status,
)

const etherBalance = (state) => get(state, 'web3.balance', 0)
export const etherBalanceSelector = createSelector(etherBalance, (balance) => {
  return formatBalance(balance)
})

const tokenBalance = (state) => get(state, 'token.balance', 0)
export const tokenBalanceSelector = createSelector(tokenBalance, (balance) => {
  return formatBalance(balance)
})

const exchangeEtherBalance = (state) => get(state, 'exchange.etherBalance', 0)
export const exchangeEtherBalanceSelector = createSelector(
  exchangeEtherBalance,
  (balance) => {
    return formatBalance(balance)
  },
)

const exchangeTokenBalance = (state) => get(state, 'exchange.tokenBalance', 0)
export const exchangeTokenBalanceSelector = createSelector(
  exchangeTokenBalance,
  (balance) => {
    return formatBalance(balance)
  },
)

const etherDepositAmount = (state) =>
  get(state, 'exchange.etherDepositAmount', null)
export const etherDepositAmountSelector = createSelector(
  etherDepositAmount,
  (amount) => amount,
)

const etherWithdrawAmount = (state) =>
  get(state, 'exchange.etherWithdrawAmount', null)
export const etherWithdrawAmountSelector = createSelector(
  etherWithdrawAmount,
  (amount) => amount,
)

const tokenDepositAmount = (state) =>
  get(state, 'exchange.tokenDepositAmount', null)
export const tokenDepositAmountSelector = createSelector(
  tokenDepositAmount,
  (amount) => amount,
)

const tokenWithdrawAmount = (state) =>
  get(state, 'exchange.tokenWithdrawAmount', null)
export const tokenWithdrawAmountSelector = createSelector(
  tokenWithdrawAmount,
  (amount) => amount,
)
