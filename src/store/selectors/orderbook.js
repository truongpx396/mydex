import { get, groupBy, reject } from 'lodash'
import { createSelector } from 'reselect'
import { ETHER_ADDRESS, GREEN, RED, roundDecimals } from '../../helpers'
import { filledOrdersLoaded, filledOrders } from './trades'
import { account, decorateOrder } from './base'

// Cancelled orders
const cancelledOrdersLoaded = (state) =>
  get(state, 'exchange.cancelledOrders.loaded', false)
export const cancelledOrdersLoadedSelector = createSelector(
  cancelledOrdersLoaded,
  (loaded) => loaded,
)

const cancelledOrders = (state) =>
  get(state, 'exchange.cancelledOrders.data', [])
export const cancelledOrdersSelector = createSelector(cancelledOrders, (o) => o)

// All Orders
const allOrdersLoaded = (state) =>
  get(state, 'exchange.allOrders.loaded', false)
const allOrders = (state) => get(state, 'exchange.allOrders.data', [])

const openOrders = (state) => {
  const all = allOrders(state)
  const filled = filledOrders(state)
  const cancelled = cancelledOrders(state)

  const openOrders = reject(all, (order) => {
    const orderFilled = filled.some((o) => o.id === order.id)
    const orderCancelled = cancelled.some((o) => o.id === order.id)
    return orderFilled || orderCancelled
  })

  return openOrders
}

const orderBookLoaded = (state) =>
  cancelledOrdersLoaded(state) &&
  filledOrdersLoaded(state) &&
  allOrdersLoaded(state)
export const orderBookLoadedSelector = createSelector(
  orderBookLoaded,
  (loaded) => loaded,
)

// Create the order book
export const orderBookSelector = createSelector(openOrders, (orders) => {
  // Decorate orders
  orders = decorateOrderBookOrders(orders)
  // Group orders by "orderType"
  orders = groupBy(orders, 'orderType')
  // Fetch buy orders
  const buyOrders = get(orders, 'buy', [])
  // Sort buy orders by token price
  orders = {
    ...orders,
    buyOrders: decorateAndSortOrdersWithSumAmount(buyOrders, true),
  }
  // Fetch sell orders
  const sellOrders = get(orders, 'sell', [])
  // Sort sell orders by token price
  orders = {
    ...orders,
    sellOrders: decorateAndSortOrdersWithSumAmount(sellOrders, false),
  }
  return orders
})

const decorateAndSortOrdersWithSumAmount = (orders, isBuyOrders) => {
  orders = isBuyOrders
    ? orders.sort((a, b) => b.tokenPrice - a.tokenPrice)
    : orders.sort((a, b) => a.tokenPrice - b.tokenPrice)
  let prevOrder = orders[0]
  orders = orders.map((order) => {
    let newSumAmount =
      order.id === prevOrder.id
        ? order.etherAmount
        : roundDecimals(order.etherAmount + prevOrder.sumAmount, 5)

    order = { ...order, sumAmount: newSumAmount }
    prevOrder = order
    return order
  })
  return isBuyOrders
    ? orders
    : orders.sort((a, b) => b.tokenPrice - a.tokenPrice)
}

const decorateOrderBookOrders = (orders) =>
  orders.map((order) => {
    order = decorateOrder(order)
    order = decorateOrderBookOrder(order)
    return order
  })

const decorateOrderBookOrder = (order) => {
  const orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell'
  return {
    ...order,
    orderType,
    orderTypeClass: orderType === 'buy' ? GREEN : RED,
    orderFillAction: orderType === 'buy' ? 'sell' : 'buy',
  }
}

export const myOpenOrdersLoadedSelector = createSelector(
  orderBookLoaded,
  (loaded) => loaded,
)

export const myOpenOrdersSelector = createSelector(
  account,
  openOrders,
  (account, orders) => {
    // Filter orders created by current account
    orders = orders.filter((o) => o.user === account)
    // Decorate orders - add display attributes
    orders = decorateMyOpenOrders(orders)
    // Sort orders by date descending
    orders = orders.sort((a, b) => b.timestamp - a.timestamp)
    return orders
  },
)

const decorateMyOpenOrders = (orders, account) => {
  return orders.map((order) => {
    order = decorateOrder(order)
    order = decorateMyOpenOrder(order, account)
    return order
  })
}

const decorateMyOpenOrder = (order, account) => {
  let orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell'

  return {
    ...order,
    orderType,
    orderTypeClass: orderType === 'buy' ? GREEN : RED,
  }
}

const orderCancelling = (state) => get(state, 'exchange.orderCancelling', false)
export const orderCancellingSelector = createSelector(
  orderCancelling,
  (status) => status,
)

const orderFilling = (state) => get(state, 'exchange.orderFilling', false)
export const orderFillingSelector = createSelector(
  orderFilling,
  (status) => status,
)
