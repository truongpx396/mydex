import { get } from 'lodash'
import { createSelector } from 'reselect'
import moment from 'moment'
import {
  ETHER_ADDRESS,
  GREEN,
  RED,
  ether,
  tokens,
  roundDecimals,
} from '../../helpers'
import Web3 from 'web3'

// TODO: Move me to helpers file

export const account = (state) => get(state, 'web3.account')
export const accountSelector = createSelector(account, (a) => a)

const web3 = (state) => get(state, 'web3.connection')
export const web3Selector = createSelector(web3, (w) => w)

const tokenLoaded = (state) => get(state, 'token.loaded', false)
export const tokenLoadedSelector = createSelector(tokenLoaded, (tl) => tl)

const token = (state) => get(state, 'token.contract')
export const tokenSelector = createSelector(token, (t) => t)

const exchangeLoaded = (state) => get(state, 'exchange.loaded', false)
export const exchangeLoadedSelector = createSelector(exchangeLoaded, (el) => el)

const exchange = (state) => get(state, 'exchange.contract')
export const exchangeSelector = createSelector(exchange, (e) => e)

export const contractsLoadedSelector = createSelector(
  tokenLoaded,
  exchangeLoaded,
  (tl, el) => tl && el,
)

export const decorateOrder = (order) => {
  let etherAmount
  let tokenAmount

  if (order.tokenGive === ETHER_ADDRESS) {
    etherAmount = order.amountGive
    tokenAmount = order.amountGet
  } else {
    etherAmount = order.amountGet
    tokenAmount = order.amountGive
  }

  // Calculate token price to 5 decimal places
  let tokenPrice = etherAmount / tokenAmount
  tokenPrice = roundDecimals(tokenPrice, 5)

  etherAmount = roundDecimals(ether(etherAmount), 5)
  tokenAmount = roundDecimals(tokens(tokenAmount), 5)

  return {
    ...order,
    etherAmount,
    tokenAmount,
    tokenPrice,
    formattedTimestamp: moment.unix(order.timestamp).format('h:mm:ss a M/D'),
  }
}

export const tokenPriceClass = (tokenPrice, orderId, previousOrder) => {
  // Show green price if only one order exists
  if (previousOrder.id === orderId) {
    return GREEN
  }

  // Show green price if order price higher than previous order
  // Show red price if order price lower than previous order
  if (previousOrder.tokenPrice <= tokenPrice) {
    return GREEN // success
  } else {
    return RED // danger
  }
}
