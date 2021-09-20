import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import {
  tokenSelector,
  accountSelector,
  web3Selector,
  exchangeSelector,
} from '../store/selectors/base'
import { loadAllOrders } from '../store/actions/orderbook'
import { subscribeToEvents } from '../store/events'
import OrderBook from './OrderBook/OrderBook'
import Trades from './Trades'
import MyTransactions from './MyTransactions/MyTransactions'
import PriceChart from './PriceChart'
import Balance from './Wallet/Balance'
import NewOrder from './NewOrder/NewOrder'

const Content = ({ dispatch, web3, token, exchange, account }) => {
  useEffect(() => {
    const loadBlockchainData = async () => {
      await loadAllOrders(exchange, dispatch)
      await subscribeToEvents(web3, exchange, token, account, dispatch)
    }
    loadBlockchainData()
  }, [dispatch, web3, token, exchange, account])

  return (
    <div className="content">
      <div className="vertical-split">
        <Balance />
        <NewOrder />
      </div>
      <OrderBook />
      <div className="vertical-split2">
        <PriceChart />
        <MyTransactions />
      </div>
      <Trades />
    </div>
  )
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
