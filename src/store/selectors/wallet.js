import { get } from 'lodash'
import { createSelector } from 'reselect'
import { formatBalance, ensureNotNull } from '../../helpers'

// const etherBalance = (state) => get(state, 'web3.balance', 0)
// export const etherBalanceSelector = createSelector(etherBalance, (balance) => {
//   return ensureNotNull(formatBalance(balance))
// })

// const tokenBalance = (state) => get(state, 'token.balance', 0)
// export const tokenBalanceSelector = createSelector(tokenBalance, (balance) => {
//   return ensureNotNull(formatBalance(balance))
// })

// const balancesLoading = (state) => get(state, 'exchange.balancesLoading', true)
// export const balancesLoadingSelector = createSelector(
//   balancesLoading,
//   (status) => status,
// )

// const exchangeEtherBalance = (state) => get(state, 'exchange.etherBalance', 0)
// export const exchangeEtherBalanceSelector = createSelector(
//   exchangeEtherBalance,
//   (balance) => {
//     return ensureNotNull(formatBalance(balance))
//   },
// )

// const exchangeTokenBalance = (state) => get(state, 'exchange.tokenBalance', 0)
// export const exchangeTokenBalanceSelector = createSelector(
//   exchangeTokenBalance,
//   (balance) => {
//     return ensureNotNull(formatBalance(balance))
//   },
// )

// const etherDepositAmount = (state) =>
//   get(state, 'exchange.etherDepositAmount', '')
// export const etherDepositAmountSelector = createSelector(
//   etherDepositAmount,
//   (amount) => ensureNotNull(amount),
// )

// const etherWithdrawAmount = (state) =>
//   get(state, 'exchange.etherWithdrawAmount', '')
// export const etherWithdrawAmountSelector = createSelector(
//   etherWithdrawAmount,
//   (amount) => ensureNotNull(amount),
// )

// const tokenDepositAmount = (state) =>
//   get(state, 'exchange.tokenDepositAmount', '')
// export const tokenDepositAmountSelector = createSelector(
//   tokenDepositAmount,
//   (amount) => ensureNotNull(amount),
// )

// const tokenWithdrawAmount = (state) =>
//   get(state, 'exchange.tokenWithdrawAmount', '')
// export const tokenWithdrawAmountSelector = createSelector(
//   tokenWithdrawAmount,
//   (amount) => ensureNotNull(amount),
// )
