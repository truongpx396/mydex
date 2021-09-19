import React from 'react'
import { connect } from 'react-redux'
import Spinner from '../Spinner'
import { exchangeSelector, accountSelector } from '../../store/selectors/base'
import {
  orderBookSelector,
  orderBookLoadedSelector,
  orderFillingSelector,
} from '../../store/selectors/orderbook'

import OrderList from './OrderList'

const OrderBook = (props) => (
  <div className="vertical">
    <div className="card bg-dark text-white">
      <div className="card-header">
        Order Book {props.showOrderBook ? null : <Spinner />}
      </div>
      <div className="card-body order-book">
        <table className="table table-dark table-sm small">
          <OrderList {...props} />
        </table>
      </div>
    </div>
  </div>
)

function mapStateToProps(state) {
  const orderBookLoaded = orderBookLoadedSelector(state)
  const orderFilling = orderFillingSelector(state)

  return {
    orderBook: orderBookSelector(state),
    showOrderBook: orderBookLoaded && !orderFilling,
    exchange: exchangeSelector(state),
    account: accountSelector(state),
  }
}

export default connect(mapStateToProps)(OrderBook)
