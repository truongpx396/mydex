import { decorateOrder, tokenPriceClass } from './base'
import { ETHER_ADDRESS, GREEN, RED } from '../../helpers'

// export const filledOrdersLoaded = (state) =>
//   get(state, 'exchange.filledOrders.loaded', false)
// export const filledOrdersLoadedSelector = createSelector(
//   filledOrdersLoaded,
//   (loaded) => loaded,
// )

// export const filledOrders = (state) =>
//   get(state, 'exchange.filledOrders.data', [])
// export const filledOrdersSelector = createSelector(filledOrders, (orders) => {
//   // Sort orders by date ascending for price comparison
//   orders = orders.sort((a, b) => a.timestamp - b.timestamp)
//   // Decorate the orders
//   orders = decorateFilledOrders(orders)
//   // Sort orders by date descending for display
//   orders = orders.sort((a, b) => b.timestamp - a.timestamp)
//   return orders
// })

export const decorateFilledOrders = (orders) => {
  // Track previous order to compare history
  let previousOrder = orders[0]
  return orders.map((order) => {
    order = decorateOrder(order)
    order = decorateFilledOrder(order, previousOrder)
    previousOrder = order // Update the previous order once it's decorated
    return order
  })
}

const decorateFilledOrder = (order, previousOrder) => {
  return {
    ...order,
    tokenPriceClass: tokenPriceClass(order.tokenPrice, order.id, previousOrder),
  }
}

// export const myFilledOrdersLoadedSelector = createSelector(
//   filledOrdersLoaded,
//   (loaded) => loaded,
// )

// export const myFilledOrdersSelector = createSelector(
//   account,
//   filledOrders,
//   (account, orders) => {
//     // Find our orders
//     orders = orders.filter((o) => o.user === account || o.userFill === account)
//     // Sort by date ascending
//     orders = orders.sort((a, b) => b.timestamp - a.timestamp)
//     // Decorate orders - add display attributes
//     orders = decorateMyFilledOrders(orders, account)
//     console.log('Decorated myfilled orders: ', orders)
//     return orders
//   },
// )

export const decorateMyFilledOrders = (orders, account) =>
  orders.map((order) => {
    order = decorateOrder(order)
    order = decorateMyFilledOrder(order, account)
    return order
  })

const decorateMyFilledOrder = (order, account) => {
  let orderType
  // if(myMadeOrder) {
  orderType = order.tokenGive === ETHER_ADDRESS ? 'sell' : 'buy'
  //} else {
  // orderType = order.tokenGive === ETHER_ADDRESS ? 'sell' : 'buy'
  //}

  return {
    ...order,
    orderType,
    orderTypeClass: orderType === 'buy' ? GREEN : RED,
    orderSign: orderType === 'buy' ? '+' : '-',
  }
}
