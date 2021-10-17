import React, { useEffect } from 'react'
import { connect, useSelector } from 'react-redux'
import { useAppDispatch,useAppSelector } from '../store/hooks'
// import {
//   tokenSelector,
//   accountSelector,
//   web3Selector,
//   exchangeSelector,
// } from '../store/selectors/base'
import { tokenSelector } from '../store/reducers/tokenReducer'
import { accountSelector,web3Selector } from '../store/reducers/web3Reducer'
import { exchangeSelector } from '../store/reducers/exchangeReducer'

import { loadAllOrders } from '../store/reducers/allOrdersReducer'
import { subscribeToEvents } from '../store/events'
import OrderBook from './OrderBook/OrderBook'
import Trades from './Trades'
import MyTransactions from './MyTransactions/MyTransactions'
import PriceChart from './PriceChart'
import Balance from './Wallet/Balance'
import NewOrder from './NewOrder/NewOrder'

// interface OwnProps{
//   dispatch:Dispatch,
// }

// type Props = StateProps & OwnProps
//{ dispatch, web3, token, exchange, account }:Props

const Content = () => {
  const dispatch = useAppDispatch()

  const token =useAppSelector(tokenSelector)
  const exchange=useAppSelector(exchangeSelector)
  const account =useAppSelector(accountSelector)
  const web3 = useAppSelector(web3Selector)

  useEffect(() => {
    const loadBlockchainData = async () => {
      if(exchange)
      await dispatch(loadAllOrders(exchange))
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

// function mapStateToProps(state: any) {
//   return {
//     account: accountSelector(state),
//     token: tokenSelector(state),
//     web3: web3Selector(state),
//     exchange: exchangeSelector(state),
//   }
// }

//type StateProps = ReturnType<typeof mapStateToProps>

// export default connect(mapStateToProps)(Content)
export default Content
