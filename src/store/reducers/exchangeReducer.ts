import { Action, combineReducers } from 'redux'
import { createSlice, PayloadAction ,createAsyncThunk} from '@reduxjs/toolkit'
import Web3 from 'web3'
import  { RootState,AppThunk,getKeyValue } from '../configureStore'
import { Contract } from 'web3-eth-contract';
import Exchange from '../../abis/Exchange.json'
import { AbiItem } from 'web3-utils';


// function exchange(state = {}, action) {
//   let index, data

//   switch (action.type) {
//     case 'EXCHANGE_LOADED':
//       return { ...state, loaded: true, contract: action.contract }
    
//     case 'BUY_ORDER_AMOUNT_CHANGED':
//       return {
//         ...state,
//         buyOrder: { ...state.buyOrder, amount: action.amount },
//       }
//     case 'BUY_ORDER_PRICE_CHANGED':
//       return { ...state, buyOrder: { ...state.buyOrder, price: action.price } }
//     case 'BUY_ORDER_MAKING':
//       return {
//         ...state,
//         buyOrder: {
//           ...state.buyOrder,
//           amount: null,
//           price: null,
//           making: true,
//         },
//       }

//     case 'SELL_ORDER_AMOUNT_CHANGED':
//       return {
//         ...state,
//         sellOrder: { ...state.sellOrder, amount: action.amount },
//       }
//     case 'SELL_ORDER_PRICE_CHANGED':
//       return {
//         ...state,
//         sellOrder: { ...state.sellOrder, price: action.price },
//       }
//     case 'SELL_ORDER_MAKING':
//       return {
//         ...state,
//         sellOrder: {
//           ...state.sellOrder,
//           amount: null,
//           price: null,
//           making: true,
//         },
//       }

//       case 'ORDER_MADE':
//         // Prevent duplicate orders
//         index = state.allOrders.data.findIndex(
//           (order) => order.id === action.order.id,
//         )
  
//         if (index === -1) {
//           data = [...state.allOrders.data, action.order]
//         } else {
//           data = state.allOrders.data
//         }
  
//         return {
//           ...state,
//           allOrders: {
//             ...state.allOrders,
//             data,
//           },
//           buyOrder: {
//             ...state.buyOrder,
//             making: false,
//           },
//           sellOrder: {
//             ...state.sellOrder,
//             making: false,
//           },
//         }

//     default:
//       return state
//   }
// }


  export const loadExchange = (networkId:any): AppThunk => async(
    dispatch,
    getState
  ) => {
    try {
        const exchange = new Contract(
          Exchange.abi as AbiItem[],
          //Exchange.networks[networkId].address,
          getKeyValue(Exchange.networks)(networkId).address
        )
        dispatch(exchangeLoaded(exchange))
        return exchange
      } catch (error) {
        console.log(
          'Contract not deployed to the current network. Please select another network with Metamask.',
        )
        return null
      }
  };
  

interface Order{
    amount: number,
    price: number,
    making: boolean,
}

const initialOrder:Order={
    amount:0,
    price:0,
    making:false
}


interface ExchangeState {
    contract: Contract | undefined,
    loaded: boolean,
    buyOrder:Order,
    sellOrder:Order,
    status: 'idle' | 'loading' | 'failed';
  }

  const initialState: ExchangeState = {
    contract:undefined,
    loaded:false,
    buyOrder:initialOrder,
    sellOrder:initialOrder,
    status: 'idle',
  }

  export const exchangeSlice = createSlice({
    name: 'exchange',
    initialState,
    reducers: {
      exchangeLoaded: (state, action: PayloadAction<Contract>) => {
        state.contract=action.payload
        state.loaded=true
      },
      buyOrderAmountChanged: (state, action: PayloadAction<number>) => {
        state.buyOrder.amount = action.payload
      },
      buyOrderPriceChanged: (state, action: PayloadAction<number>) => {
        state.buyOrder.price = action.payload
      },
      sellOrderAmountChanged: (state, action: PayloadAction<number>) => {
        state.sellOrder.amount = action.payload
      },
      sellOrderPriceChanged: (state, action: PayloadAction<number>) => {
        state.sellOrder.price = action.payload
      },
      buyOrderMaking: (state, _) => {
        state.buyOrder.amount = 0
        state.buyOrder.price=0
        state.buyOrder.making=true
      },
      sellOrderMaking: (state, _) => {
        state.sellOrder.amount = 0
        state.sellOrder.price=0
        state.sellOrder.making=true
      },
      orderMade:(state,_)=>{
          state.buyOrder.making=false
          state.sellOrder.making=false
      }
    },
    extraReducers: (builder) => {
      builder
        // .addCase(incrementAsync.pending, (state) => {
        //   state.status = 'loading';
        // })
        // .addCase(incrementAsync.fulfilled, (state, action) => {
        //   state.status = 'idle';
        //   state.value += action.payload;
        // });
    },
  })
  
  export const { exchangeLoaded, buyOrderAmountChanged, buyOrderPriceChanged,
    sellOrderAmountChanged,sellOrderPriceChanged,buyOrderMaking,
    sellOrderMaking,orderMade} = exchangeSlice.actions
  
  // Other code such as selectors can use the imported `RootState` type
  export const exchangeSelector = (state: RootState) => state.exchange.contract
  
  export const exchangeLoadedSelector = (state: RootState) => state.exchange.loaded

  const exchangeReducer=exchangeSlice.reducer

  export default exchangeReducer
  
