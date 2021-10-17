import { createSlice, PayloadAction ,createEntityAdapter} from '@reduxjs/toolkit'
import  { RootState,AppThunk } from '../configureStore'
import { Contract } from 'web3-eth-contract';
import OrderBook from './orderbookEntity';


// function orderBook(state = {}, action) {
//   let index, data

//   switch (action.type) {
//     case 'CANCELLED_ORDERS_LOADED':
//       return {
//         ...state,
//         cancelledOrders: { loaded: true, data: action.cancelledOrders },
//       }
//     case 'FILLED_ORDERS_LOADED':
//       return {
//         ...state,
//         filledOrders: { loaded: true, data: action.filledOrders },
//       }
//     case 'ALL_ORDERS_LOADED':
//       return { ...state, allOrders: { loaded: true, data: action.allOrders } }
//     case 'ORDER_CANCELLING':
//       return { ...state, orderCancelling: true }
//     case 'ORDER_CANCELLED':
//       return {
//         ...state,
//         orderCancelling: false,
//         cancelledOrders: {
//           ...state.cancelledOrders,
//           data: [...state.cancelledOrders.data, action.order],
//         },
//       }
//     case 'ORDER_FILLED':
//       // Prevent duplicate orders
//       index = state.filledOrders.data.findIndex(
//         (order) => order.id === action.order.id,
//       )

//       if (index === -1) {
//         data = [...state.filledOrders.data, action.order]
//       } else {
//         data = state.filledOrders.data
//       }

//       return {
//         ...state,
//         orderFilling: false,
//         filledOrders: {
//           ...state.filledOrders,
//           data,
//         },
//       }

//     case 'ORDER_FILLING':
//       return { ...state, orderFilling: true }

//     case 'ORDER_MADE':
//       // Prevent duplicate orders
//       index = state.allOrders.data.findIndex(
//         (order) => order.id === action.order.id,
//       )

//       if (index === -1) {
//         data = [...state.allOrders.data, action.order]
//       } else {
//         data = state.allOrders.data
//       }

//       return {
//         ...state,
//         allOrders: {
//           ...state.allOrders,
//           data,
//         },
//         buyOrder: {
//           ...state.buyOrder,
//           making: false,
//         },
//         sellOrder: {
//           ...state.sellOrder,
//           making: false,
//         },
//       }

//     default:
//       return state
//   }
// }



// export const cancelOrder = (dispatch , exchange :Contract, order, account) => {
//   exchange.methods
//     .cancelOrder(order.id)
//     .send({ from: account })
//     .on('transactionHash', (hash:any) => {
//       dispatch(orderCancelling())
//     })
//     .on('error', (error:any) => {
//       console.log(error)
//       window.alert('There was an error!')
//     })
// }

export const cancelOrder = ( exchange :Contract, order:OrderBook, account:string): AppThunk => async(
  dispatch,
  getState
) => {
  exchange.methods
  .cancelOrder(order.id)
  .send({ from: account })
  .on('transactionHash', (hash:any) => {
    dispatch(orderCancelling())
  })
  .on('error', (error:any) => {
    console.log(error)
    window.alert('There was an error!')
  })
};

const cancelledOrdersAdapter = createEntityAdapter<OrderBook>()

export const cancelledOrdersSlice = createSlice({
  name: 'cancelledOrders',
  initialState: cancelledOrdersAdapter.getInitialState({loaded:false,orderCancelling:false}),
  reducers: {
    orderCancelling:(state)=>{
      state.orderCancelling=true
    },
    orderCancelled:(state,action:PayloadAction<OrderBook>)=>{
      state.orderCancelling=false
      cancelledOrdersAdapter.addOne(state,action.payload)
    },
    cancelledOrdersLoaded:(state,action: PayloadAction<OrderBook[]>)=>{
      state.loaded=true
      cancelledOrdersAdapter.upsertMany(state,action.payload)
    }
  },
  // extraReducers: (builder) => {
  //   builder.addCase(fetchArticle.fulfilled, (state, action) => {
  //     // And handle the same fetch result by inserting the users here
  //     state.loaded=true
  //     cancelledOrdersAdapter.upsertMany(state, action.payload.cancelledOrders)
  //   })
  // },
})

export const { orderCancelling, orderCancelled,cancelledOrdersLoaded } = cancelledOrdersSlice.actions

export const {
  selectById: selectCancelledOrderById,
  selectIds: selectCancelledOrdersIds,
  selectEntities: selectCancelledOrdersEntities,
  selectAll: cancelledOrdersSelector,
  selectTotal: selectTotalCancelledOrders,
} = cancelledOrdersAdapter.getSelectors((state :RootState) => state.cancelledOrders)

export const cancelledOrdersLoadedSelector= (state:RootState)=>state.cancelledOrders.loaded
export const orderCancellingSelector = (state: RootState) => state.cancelledOrders.orderCancelling

export const cancelledOrdersReducer = cancelledOrdersSlice.reducer