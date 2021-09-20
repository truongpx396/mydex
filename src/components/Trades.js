import React from 'react'
import { connect } from 'react-redux'
import Spinner from './Spinner'
import {
  filledOrdersLoadedSelector,
  filledOrdersSelector,
} from '../store/selectors/trades'

const FilledOrderList = ({ filledOrders }) => {
  return (
    <tbody>
      {filledOrders.map((order) => {
        return (
          <tr className={`order-${order.id}`} key={order.id}>
            <td className={`text-${order.tokenPriceClass}`}>
              {order.tokenPrice}
            </td>
            <td>{order.tokenAmount}</td>
            <td className="text-muted">{order.formattedTimestamp}</td>
          </tr>
        )
      })}
    </tbody>
  )
}

const Trades = (props) => {
  return (
    <div className="vertical">
      <div className="card bg-dark text-white">
        <div className="card-header">
          Trades {props.filledOrdersLoaded ? null : <Spinner />}
        </div>
        <div className="card-body">
          <table className="table table-dark table-sm small">
            <thead>
              <tr>
                <th>Price</th>
                <th>DAPP</th>
                <th>Time</th>
              </tr>
            </thead>
            <FilledOrderList {...props} />
          </table>
        </div>
      </div>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    filledOrdersLoaded: filledOrdersLoadedSelector(state),
    filledOrders: filledOrdersSelector(state),
  }
}

export default connect(mapStateToProps)(Trades)
