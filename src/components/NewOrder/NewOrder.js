import React from 'react'
import { connect } from 'react-redux'
import Spinner from '../Spinner'
import {
  exchangeSelector,
  tokenSelector,
  accountSelector,
  web3Selector,
} from '../../store/selectors/base'
import {
  buyOrderSelector,
  sellOrderSelector,
} from '../../store/selectors/new_order'

import OrderForm from './OrderForm'

const NewOrder = (props) => {
  return (
    <div className="card bg-dark text-white">
      <div className="card-header">
        New Order {props.showForm ? null : <Spinner />}
      </div>
      <div className="card-body">
        <OrderForm {...props} />
      </div>
    </div>
  )
}

function mapStateToProps(state) {
  const buyOrder = buyOrderSelector(state)
  const sellOrder = sellOrderSelector(state)

  return {
    account: accountSelector(state),
    exchange: exchangeSelector(state),
    token: tokenSelector(state),
    web3: web3Selector(state),
    buyOrder,
    sellOrder,
    showForm: !buyOrder.making && !sellOrder.making,
    showBuyTotal: buyOrder.amount && buyOrder.price,
    showSellTotal: sellOrder.amount && sellOrder.price,
  }
}

export default connect(mapStateToProps)(NewOrder)
