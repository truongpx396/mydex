
import { createSlice, PayloadAction ,createEntityAdapter,createSelector} from '@reduxjs/toolkit'
import  { RootState,AppThunk } from '../configureStore'
import { Contract } from 'web3-eth-contract';
import {accountSelector} from './web3Reducer';
import {decorateFilledOrders,decorateMyFilledOrders} from '../selectors/trades'
import OrderBook from './orderbookEntity';


///////////////////

// export const fillOrder = (dispatch, exchange, order, account) => {
//   exchange.methods
//     .fillOrder(order.id)
//     .send({ from: account })
//     .on('transactionHash', (hash) => {
//       dispatch(orderFilling())
//     })
//     .on('error', (error) => {
//       console.log(error)
//       window.alert('There was an error!')
//     })
// }

export const fillOrder = ( exchange :Contract, order:OrderBook, account:string): AppThunk => async(
    dispatch,
    getState
  ) => {
    exchange.methods
      .fillOrder(order.id)
      .send({ from: account })
      .on('transactionHash', (hash:any) => {
        dispatch(orderFilling())
      })
      .on('error', (error:any) => {
        console.log(error)
        window.alert('There was an error!')
      })
  };
  
  const filledOrdersAdapter = createEntityAdapter<OrderBook>()
  
  export const filledOrdersSlice = createSlice({
    name: 'filledOrders',
    initialState: filledOrdersAdapter.getInitialState({loaded:false,orderfilling:false}),
    reducers: {
      orderFilling:(state)=>{
        state.orderfilling=true
      },
      orderFillled:(state)=>{
        state.orderfilling=false
        filledOrdersAdapter.addOne
      },
      filledOrdersLoaded:(state,action: PayloadAction<OrderBook[]>)=>{
        state.loaded=true
        filledOrdersAdapter.upsertMany(state,action.payload)
      }
    },
  })
  
  export const { orderFilling, orderFillled,filledOrdersLoaded } = filledOrdersSlice.actions
  
  export const {
    selectById: selectFilledOrderById,
    selectAll: filledOrders,
  } = filledOrdersAdapter.getSelectors((state :RootState) => state.filledOrders)
  
  export const filledOrdersLoadedSelector= (state:RootState)=>state.filledOrders.loaded
  export const orderFillingSelector = (state: RootState) => state.filledOrders.orderfilling
  
  export const filledOrdersSelector = createSelector(filledOrders, (orders) => {
    // Sort orders by date ascending for price comparison
    orders = orders.sort((a, b) => a.timestamp - b.timestamp)
    // Decorate the orders
    orders = decorateFilledOrders(orders)
    // Sort orders by date descending for display
    orders = orders.sort((a, b) => b.timestamp - a.timestamp)
    return orders
  })
  
  export const myFilledOrdersLoadedSelector = createSelector(
    filledOrdersLoadedSelector,
    (loaded) => loaded,
  )
  
  export const myFilledOrdersSelector = createSelector(
    accountSelector,
    filledOrders,
    (account, orders) => {
      // Find our orders
      orders = orders.filter((o) => o.user === account || o.userFill === account)
      // Sort by date ascending
      orders = orders.sort((a, b) => b.timestamp - a.timestamp)
      // Decorate orders - add display attributes
      orders = decorateMyFilledOrders(orders, account)
      console.log('Decorated myfilled orders: ', orders)
      return orders
    },
  )
  
  export const filledOrdersReducer = filledOrdersSlice.reducer
  