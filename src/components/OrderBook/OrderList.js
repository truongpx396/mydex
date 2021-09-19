import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { fillOrder } from '../../store/actions/orderbook'

const OrderItem = ({ order, dispatch, exchange, account }) => (
  <OverlayTrigger
    key={order.id}
    placement="auto"
    overlay={
      <Tooltip id={order.id}>
        {`Click here to ${order.orderFillAction}`}
      </Tooltip>
    }
  >
    <tr
      className="order-book-order"
      onClick={(e) => fillOrder(dispatch, exchange, order, account)}
    >
      <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
      <td>{order.tokenAmount}</td>
      <td>{order.sumAmount}</td>
    </tr>
  </OverlayTrigger>
)

const OrderList = ({ orderBook, ...props }) => (
  <tbody>
    {orderBook.sellOrders.map((order) => (
      <OrderItem key={order.id} order={order} {...props} />
    ))}
    <tr>
      <th>Price</th>
      <th>Amount</th>
      <th>Sum</th>
    </tr>
    {orderBook.buyOrders.map((order) => (
      <OrderItem key={order.id} order={order} {...props} />
    ))}
  </tbody>
)

export default OrderList
