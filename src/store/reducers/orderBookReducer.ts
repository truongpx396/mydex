import { Action, combineReducers } from 'redux'
import { createSlice, PayloadAction ,createEntityAdapter} from '@reduxjs/toolkit'
import Web3 from 'web3'
import  { RootState,AppThunk } from '../configureStore'
import { Contract } from 'web3-eth-contract';
import Exchange from '../../abis/Exchange.json'
import { AbiItem } from 'web3-utils';


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

interface OrderBook {
  id:number,
  tokenGive:string
  amountTokeGive: number,
  tokenGet: string,
  amountTokenGet: number,
}

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

const cancelledOrdersAdapter = createEntityAdapter()

export const cancelledOrdersSlice = createSlice({
  name: 'cancelledOrders',
  initialState: cancelledOrdersAdapter.getInitialState({loaded:false,orderCancelling:false}),
  reducers: {
    orderCancelling:(state)=>{
      state.orderCancelling=true
    },
    orderCancelled:(state)=>{
      state.orderCancelling=false
      cancelledOrdersAdapter.addOne
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

const filledOrdersAdapter = createEntityAdapter()

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
  selectAll: filledOrdersSelector,
} = filledOrdersAdapter.getSelectors((state :RootState) => state.filledOrders)

export const filledOrdersLoadedSelector= (state:RootState)=>state.filledOrders.loaded
export const orderFillingSelector = (state: RootState) => state.filledOrders.orderfilling


export const filledOrdersReducer = filledOrdersSlice.reducer

/////////////////////////

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

const allOrdersAdapter = createEntityAdapter()

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

