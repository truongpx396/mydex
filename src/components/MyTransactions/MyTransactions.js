import React from 'react'
import { connect } from 'react-redux'
import { Tabs, Tab } from 'react-bootstrap'
import Spinner from '../Spinner'
import { exchangeSelector, accountSelector } from '../../store/selectors/base'
import {
  myFilledOrdersLoadedSelector,
  myFilledOrdersSelector,
} from '../../store/selectors/trades'
import {
  myOpenOrdersLoadedSelector,
  myOpenOrdersSelector,
  orderCancellingSelector,
} from '../../store/selectors/orderbook'

import MyOpenOrderList from './MyOpenOrderList'
import MyFilledOrderList from './MyFilledOrderList'

const MyTransactions = (props) => {
  return (
    <div className="card bg-dark text-white">
      {/* <div className="card-header">My Transactions</div> */}
      <div className="card-body">
        <Tabs defaultActiveKey="trades" className="bg-dark text-white">
          <Tab eventKey="orders" title="Open Orders">
            <table className="table table-dark table-sm small">
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Price</th>
                  <th>Cancel</th>
                </tr>
              </thead>
              {props.showMyOpenOrders ? (
                <MyOpenOrderList {...props} />
              ) : (
                <Spinner type="table" />
              )}
            </table>
          </Tab>
          <Tab eventKey="trades" title="Order History" className="bg-dark">
            <table className="table table-dark table-sm small">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>DAPP</th>
                  <th>Price</th>
                </tr>
              </thead>
              {props.showMyFilledOrders ? (
                <MyFilledOrderList {...props} />
              ) : (
                <Spinner type="table" />
              )}
            </table>
          </Tab>
        </Tabs>
      </div>
    </div>
  )
}

function mapStateToProps(state) {
  const myOpenOrdersLoaded = myOpenOrdersLoadedSelector(state)
  const orderCancelling = orderCancellingSelector(state)

  return {
    myFilledOrders: myFilledOrdersSelector(state),
    showMyFilledOrders: myFilledOrdersLoadedSelector(state),
    myOpenOrders: myOpenOrdersSelector(state),
    showMyOpenOrders: myOpenOrdersLoaded && !orderCancelling,
    exchange: exchangeSelector(state),
    account: accountSelector(state),
  }
}

export default connect(mapStateToProps)(MyTransactions)
