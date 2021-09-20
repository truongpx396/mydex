import React from 'react'
import { cancelOrder } from '../../store/actions/orderbook'

const MyOpenOrderList = ({ myOpenOrders, dispatch, exchange, account }) => {
  return (
    <tbody>
      {myOpenOrders.map((order) => {
        return (
          <tr key={order.id}>
            <td className={`text-${order.orderTypeClass}`}>
              {order.tokenAmount}
            </td>
            <td className={`text-${order.orderTypeClass}`}>
              {order.tokenPrice}
            </td>
            <td
              className="text-muted cancel-order"
              onClick={(e) => {
                cancelOrder(dispatch, exchange, order, account)
              }}
            >
              X
            </td>
          </tr>
        )
      })}
    </tbody>
  )
}

export default MyOpenOrderList
