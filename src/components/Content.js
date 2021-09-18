import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  tokenSelector,
  accountSelector,
  web3Selector,
  exchangeSelector,
} from '../store/selectors/base'
import { loadAllOrders } from '../store/actions/orderbook'
import { subscribeToEvents } from '../store/events'
import OrderBook from './OrderBook'
import Trades from './Trades'
import MyTransactions from './MyTransactions'
import PriceChart from './PriceChart'
import Balance from './Wallet/Balance'
import NewOrder from './NewOrder/NewOrder'

class Content extends Component {
  componentWillMount() {
    this.loadBlockchainData(this.props)
  }

  async loadBlockchainData(props) {
    const { dispatch, web3, token, exchange, account } = props
    await loadAllOrders(exchange, dispatch)
    await subscribeToEvents(web3, exchange, token, account, dispatch)
  }

  render() {
    return (
      <div className="content">
        <div className="vertical-split">
          <Balance />
          <NewOrder />
        </div>
        <OrderBook />
        <div className="vertical-split">
          <PriceChart />
          <MyTransactions />
        </div>
        <Trades />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    account: accountSelector(state),
    token: tokenSelector(state),
    web3: web3Selector(state),
    exchange: exchangeSelector(state),
  }
}

export default connect(mapStateToProps)(Content)
