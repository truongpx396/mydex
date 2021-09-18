import { loadBalances } from './actions/wallet'

// Generic Order
export function orderMade(order) {
  return {
    type: 'ORDER_MADE',
    order,
  }
}

export function orderCancelled(order) {
  return {
    type: 'ORDER_CANCELLED',
    order,
  }
}

// Fill Order
export function orderFilled(order) {
  return {
    type: 'ORDER_FILLED',
    order,
  }
}

export const subscribeToEvents = async (
  web3,
  exchange,
  token,
  account,
  dispatch,
) => {
  exchange.events.Cancel({}, (error, event) => {
    dispatch(orderCancelled(event.returnValues))
  })

  exchange.events.Trade({}, (error, event) => {
    loadBalances(dispatch, web3, exchange, token, account)
    dispatch(orderFilled(event.returnValues))
  })

  exchange.events.Deposit({}, (error, event) => {
    loadBalances(dispatch, web3, exchange, token, account)
  })

  exchange.events.Withdraw({}, (error, event) => {
    loadBalances(dispatch, web3, exchange, token, account)
  })

  exchange.events.Order({}, (error, event) => {
    dispatch(orderMade(event.returnValues))
  })
}
