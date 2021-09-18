import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import {
  buyOrderAmountChanged,
  buyOrderPriceChanged,
  sellOrderAmountChanged,
  sellOrderPriceChanged,
} from '../../store/actions'
import { makeBuyOrder, makeSellOrder } from '../../store/interactions'

const OrderForm = (props) => {
  return (
    <Tabs defaultActiveKey="buy" className="bg-dark text-white">
      <Tab eventKey="buy" title="Buy" className="bg-dark">
        <OrderTab {...props} isBuy />
      </Tab>
      <Tab eventKey="sell" title="Sell" className="bg-dark">
        <OrderTab {...props} isBuy={false} />
      </Tab>
    </Tabs>
  )
}

const OrderTab = ({
  isBuy,
  dispatch,
  buyOrder,
  exchange,
  token,
  web3,
  account,
  sellOrder,
  showBuyTotal,
  showSellTotal,
}) => {
  return (
    <>
      {console.log('BuyAmount: ', buyOrder.amount)}
      <form
        onSubmit={(event) => {
          event.preventDefault()
          isBuy
            ? makeBuyOrder(dispatch, exchange, token, web3, buyOrder, account)
            : makeSellOrder(dispatch, exchange, token, web3, sellOrder, account)
        }}
      >
        <div className="mt-2 mb-2">
          <div className="input-group input-group-sm mb-3">
            <input
              type="text"
              className="form-control form-control-sm bg-dark text-white"
              placeholder="Amount"
              value={
                isBuy
                  ? buyOrder.amount == null
                    ? ''
                    : buyOrder.amount
                  : sellOrder.amount == null
                  ? ''
                  : sellOrder.amount
              }
              onChange={(e) =>
                isBuy
                  ? dispatch(buyOrderAmountChanged(e.target.value))
                  : dispatch(sellOrderAmountChanged(e.target.value))
              }
              required
            />
            <div className="input-group-append">
              <span className="input-group-text" id="inputGroup-sizing-sm">
                {'DAPP'}
              </span>
            </div>
          </div>
          <div className="input-group">
            <input
              type="text"
              className="form-control form-control-sm bg-dark text-white"
              placeholder="Price"
              value={
                isBuy
                  ? buyOrder.price == null
                    ? ''
                    : buyOrder.price
                  : sellOrder.price == null
                  ? ''
                  : sellOrder.price
              }
              onChange={(e) =>
                isBuy
                  ? dispatch(buyOrderPriceChanged(e.target.value))
                  : dispatch(sellOrderPriceChanged(e.target.value))
              }
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className={`btn ${
            isBuy ? 'btn-success' : 'btn-danger'
          } btn-sm btn-block`}
        >
          {isBuy ? 'Buy' : 'Sell'}
        </button>

        {isBuy ? (
          showBuyTotal ? (
            <small>Total: {buyOrder.amount * buyOrder.price} ETH</small>
          ) : null
        ) : showSellTotal ? (
          <small>Total: {sellOrder.amount * sellOrder.price} ETH</small>
        ) : null}
      </form>
    </>
  )
}

export default OrderForm
