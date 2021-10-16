import { createSlice, PayloadAction ,createEntityAdapter,createSelector} from '@reduxjs/toolkit'
import  { RootState,AppThunk } from '../configureStore'
import { Contract } from 'web3-eth-contract';
import { get, groupBy, reject } from 'lodash'
//import { myFilledOrdersLoadedSelector } from '../selectors/trades';
import {accountSelector} from './web3Reducer';
import {decorateOrderBookOrders,decorateAndSortOrdersWithSumAmount,decorateMyOpenOrders} from '../selectors/orderbook'
import OrderBook from './orderbookEntity';
import { cancelledOrdersLoaded,cancelledOrdersLoadedSelector,cancelledOrdersSelector } from './cancelledOrdersReducer';
import { filledOrdersLoaded,myFilledOrdersLoadedSelector,filledOrdersSelector } from './filledOrdersReducer';


// export const loadAllOrders = async (exchange, dispatch) => {
//   // Fetch cancelled orders with the "Cancel" event stream
//   const cancelStream = await exchange.getPastEvents('Cancel', {
//     fromBlock: 0,
//     toBlock: 'latest',
//   })
//   // Format cancelled orders
//   const cancelledOrders = cancelStream.map((event) => event.returnValues)
//   // Add cancelled orders to the redux store
//   dispatch(cancelledOrdersLoaded(cancelledOrders))

//   // Fetch filled orders with the "Trade" event stream
//   const tradeStream = await exchange.getPastEvents('Trade', {
//     fromBlock: 0,
//     toBlock: 'latest',
//   })
//   // Format filled orders
//   const filledOrders = tradeStream.map((event) => event.returnValues)
//   // Add cancelled orders to the redux store
//   dispatch(filledOrdersLoaded(filledOrders))

//   // Load order stream
//   const orderStream = await exchange.getPastEvents('Order', {
//     fromBlock: 0,
//     toBlock: 'latest',
//   })
//   // Format order stream
//   const allOrders = orderStream.map((event) => event.returnValues)
//   // Add open orders to the redux store
//   dispatch(allOrdersLoaded(allOrders))
// }

export const loadAllOrders = ( exchange :Contract): AppThunk => async(
  dispatch,
  getState
) => {
  // Fetch cancelled orders with the "Cancel" event stream
  const cancelStream = await exchange.getPastEvents('Cancel', {
    fromBlock: 0,
    toBlock: 'latest',
  })
  // Format cancelled orders
  const cancelledOrders = cancelStream.map((event) => event.returnValues as OrderBook) 
  // Add cancelled orders to the redux store
  dispatch(cancelledOrdersLoaded(cancelledOrders))

  // Fetch filled orders with the "Trade" event stream
  const tradeStream = await exchange.getPastEvents('Trade', {
    fromBlock: 0,
    toBlock: 'latest',
  })
  // Format filled orders
  const filledOrders = tradeStream.map((event) => event.returnValues as OrderBook)
  // Add cancelled orders to the redux store
  dispatch(filledOrdersLoaded(filledOrders))

  // Load order stream
  const orderStream = await exchange.getPastEvents('Order', {
    fromBlock: 0,
    toBlock: 'latest',
  })
  // Format order stream
  const allOrders = orderStream.map((event) => event.returnValues as OrderBook)
  // Add open orders to the redux store
  dispatch(allOrdersLoaded(allOrders))
};

const allOrdersAdapter = createEntityAdapter<OrderBook>()

export const allOrdersSlice = createSlice({
  name: 'allOrders',
  initialState: allOrdersAdapter.getInitialState({loaded:false}),
  reducers: {
    orderMade:allOrdersAdapter.addOne,
    allOrdersLoaded:(state,action: PayloadAction<OrderBook[]>)=>{
      state.loaded=true
      allOrdersAdapter.upsertMany(state,action.payload)
    }
  },
})

export const { orderMade, allOrdersLoaded } = allOrdersSlice.actions


export const {
  selectById: selectOrderById,
  selectAll: allOrders,
} = allOrdersAdapter.getSelectors((state :RootState) => state.allOrders)

export const allOrdersLoadedSelector= (state:RootState)=>state.allOrders.loaded

export const allOrdersReducer = allOrdersSlice.reducer

const openOrders = (state :RootState) :OrderBook[]=> {
  const all = allOrders(state)
  const filled = filledOrdersSelector(state)
  const cancelled = cancelledOrdersSelector(state)

  const openOrders = reject(all, (order :OrderBook) => {
    const orderFilled = filled.some((o :OrderBook) => o.id === order.id)
    const orderCancelled = cancelled.some((o :OrderBook) => o.id === order.id)
    return orderFilled || orderCancelled
  })

  return openOrders
}

const orderBookLoaded = (state :RootState):boolean =>
  cancelledOrdersLoadedSelector(state) &&
  myFilledOrdersLoadedSelector(state) &&
  allOrdersLoadedSelector(state)
export const orderBookLoadedSelector = createSelector(
  orderBookLoaded,
  (loaded) => loaded,
)

// Create the order book
export const orderBookSelector = createSelector(openOrders, (orders) => {
  // Decorate orders
  orders = decorateOrderBookOrders(orders)
  // Group orders by "orderType"
  const ordersGrouped = groupBy(orders, 'orderType')
  // Fetch buy orders
  const buyOrders = get(ordersGrouped, 'buy', [])
  // Sort buy orders by token price
  let ordersNormalized = {
    ...orders,
    buyOrders: decorateAndSortOrdersWithSumAmount(buyOrders, true) as OrderBook[],
    sellOrders:{}
  }
  // Fetch sell orders
  const sellOrders = get(ordersGrouped, 'sell', [])
  // Sort sell orders by token price
  ordersNormalized = {
    ...ordersNormalized,
    sellOrders: decorateAndSortOrdersWithSumAmount(sellOrders, false) as OrderBook[],
  }
  return ordersNormalized
})

export const myOpenOrdersLoadedSelector = createSelector(
  orderBookLoaded,
  (loaded) => loaded,
)

export const myOpenOrdersSelector = createSelector(
  accountSelector,
  openOrders,
  (account, orders) => {
    // Filter orders created by current account
    orders = orders.filter((o) => o.user === account)
    // Decorate orders - add display attributes
    orders = decorateMyOpenOrders(orders)
    // Sort orders by date descending
    orders = orders.sort((a, b) => b.timestamp - a.timestamp)
    return orders
  },
)


