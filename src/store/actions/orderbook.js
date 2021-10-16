// export function cancelledOrdersLoaded(cancelledOrders) {
//   return {
//     type: 'CANCELLED_ORDERS_LOADED',
//     cancelledOrders,
//   }
// }

// export function filledOrdersLoaded(filledOrders) {
//   return {
//     type: 'FILLED_ORDERS_LOADED',
//     filledOrders,
//   }
// }

// export function allOrdersLoaded(allOrders) {
//   return {
//     type: 'ALL_ORDERS_LOADED',
//     allOrders,
//   }
// }

// export const loadAllOrders = async (exchange, dispatch) => {
//   // Fetch cancelled orders with the "Cancel" event stream
//   const cancelStream = await exchange.getPastEvents('Cancel', {
//     fromBlock: 0,
//     toBlock: 'latest',
//   })
//   // Format cancelled orders
//   const cancelledOrders = cancelStream.map((event) => event.returnValues)
//   // Add cancelled orders to the redux store
//   dispatch(cancelledOrdersLoaded(cancelledOrders))

//   // Fetch filled orders with the "Trade" event stream
//   const tradeStream = await exchange.getPastEvents('Trade', {
//     fromBlock: 0,
//     toBlock: 'latest',
//   })
//   // Format filled orders
//   const filledOrders = tradeStream.map((event) => event.returnValues)
//   // Add cancelled orders to the redux store
//   dispatch(filledOrdersLoaded(filledOrders))

//   // Load order stream
//   const orderStream = await exchange.getPastEvents('Order', {
//     fromBlock: 0,
//     toBlock: 'latest',
//   })
//   // Format order stream
//   const allOrders = orderStream.map((event) => event.returnValues)
//   // Add open orders to the redux store
//   dispatch(allOrdersLoaded(allOrders))
// }

// export function orderCancelling() {
//   return {
//     type: 'ORDER_CANCELLING',
//   }
// }

// export const cancelOrder = (dispatch, exchange, order, account) => {
//   exchange.methods
//     .cancelOrder(order.id)
//     .send({ from: account })
//     .on('transactionHash', (hash) => {
//       dispatch(orderCancelling())
//     })
//     .on('error', (error) => {
//       console.log(error)
//       window.alert('There was an error!')
//     })
// }

// export function orderFilling() {
//   return {
//     type: 'ORDER_FILLING',
//   }
// }

// export const fillOrder = (dispatch, exchange, order, account) => {
//   exchange.methods
//     .fillOrder(order.id)
//     .send({ from: account })
//     .on('transactionHash', (hash) => {
//       dispatch(orderFilling())
//     })
//     .on('error', (error) => {
//       console.log(error)
//       window.alert('There was an error!')
//     })
// }
