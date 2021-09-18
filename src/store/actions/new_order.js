import { ETHER_ADDRESS } from '../../helpers'

// Buy Order
export function buyOrderAmountChanged(amount) {
  return {
    type: 'BUY_ORDER_AMOUNT_CHANGED',
    amount,
  }
}

export function buyOrderPriceChanged(price) {
  return {
    type: 'BUY_ORDER_PRICE_CHANGED',
    price,
  }
}

// Sell Order
export function sellOrderAmountChanged(amount) {
  return {
    type: 'SELL_ORDER_AMOUNT_CHANGED',
    amount,
  }
}

export function sellOrderPriceChanged(price) {
  return {
    type: 'SELL_ORDER_PRICE_CHANGED',
    price,
  }
}

export function buyOrderMaking(price) {
  return {
    type: 'BUY_ORDER_MAKING',
  }
}

export const makeBuyOrder = (
  dispatch,
  exchange,
  token,
  web3,
  order,
  account,
) => {
  const tokenGet = token.options.address
  const amountGet = web3.utils.toWei(order.amount, 'ether')
  const tokenGive = ETHER_ADDRESS
  const amountGive = web3.utils.toWei(
    (order.amount * order.price).toString(),
    'ether',
  )

  exchange.methods
    .makeOrder(tokenGet, amountGet, tokenGive, amountGive)
    .send({ from: account })
    .on('transactionHash', (hash) => {
      dispatch(buyOrderMaking())
    })
    .on('error', (error) => {
      console.error(error)
      window.alert(`There was an error!`)
    })
}

export function sellOrderMaking(price) {
  return {
    type: 'SELL_ORDER_MAKING',
  }
}

export const makeSellOrder = (
  dispatch,
  exchange,
  token,
  web3,
  order,
  account,
) => {
  const tokenGet = ETHER_ADDRESS
  const amountGet = web3.utils.toWei(
    (order.amount * order.price).toString(),
    'ether',
  )
  const tokenGive = token.options.address
  const amountGive = web3.utils.toWei(order.amount, 'ether')

  exchange.methods
    .makeOrder(tokenGet, amountGet, tokenGive, amountGive)
    .send({ from: account })
    .on('transactionHash', (hash) => {
      dispatch(sellOrderMaking())
    })
    .on('error', (error) => {
      console.error(error)
      window.alert(`There was an error!`)
    })
}
