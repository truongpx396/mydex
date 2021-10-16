import { Action, combineReducers } from 'redux'
import { createSlice, PayloadAction ,createAsyncThunk,createSelector} from '@reduxjs/toolkit'
import Web3 from 'web3'
import  { RootState,AppThunk,getKeyValue } from '../configureStore'
import { Contract } from 'web3-eth-contract';
import Exchange from '../../abis/Exchange.json'
import { AbiItem } from 'web3-utils';
import { tokenLoadedSelector } from './tokenReducer';
import { ETHER_ADDRESS } from '../../helpers'
import OrderBook from './orderbookEntity';
import BN from 'bn.js'


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
    amount: BN,
    price: number,
    making: boolean,
}

const defaultAmount = new BN(0)

const initialOrder:Order={
    amount:defaultAmount,
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
      buyOrderAmountChanged: (state, action: PayloadAction<BN>) => {
        state.buyOrder.amount = action.payload
      },
      buyOrderPriceChanged: (state, action: PayloadAction<number>) => {
        state.buyOrder.price = action.payload
      },
      sellOrderAmountChanged: (state, action: PayloadAction<BN>) => {
        state.sellOrder.amount = action.payload
      },
      sellOrderPriceChanged: (state, action: PayloadAction<number>) => {
        state.sellOrder.price = action.payload
      },
      buyOrderMaking: (state) => {
        state.buyOrder.amount = defaultAmount
        state.buyOrder.price=0
        state.buyOrder.making=true
      },
      sellOrderMaking: (state) => {
        state.sellOrder.amount = defaultAmount
        state.sellOrder.price=0
        state.sellOrder.making=true
      },
      orderMade:(state)=>{
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

  export const buyOrderSelector = (state: RootState) => state.exchange.buyOrder

  export const sellOrderSelector = (state: RootState) => state.exchange.sellOrder
  
  export const exchangeLoadedSelector = (state: RootState) => state.exchange.loaded

  export const contractsLoadedSelector = createSelector(
    tokenLoadedSelector,
    exchangeLoadedSelector,
    (tl, el) => tl && el,
  )

 
  export const makeBuyOrder = (exchange :Contract,
    token :Contract,
    web3 :Web3,
    order :Order,
    account:String): AppThunk => async(
    dispatch,
    getState
  ) => {
    const tokenGet = token.options.address
    const amountGet = web3.utils.toWei(order.amount, 'ether')
    const tokenGive = ETHER_ADDRESS
    const amountGive = web3.utils.toWei(
      (order.amount.toNumber() * order.price).toString(),
      'ether',
    )
  
    exchange.methods
      .makeOrder(tokenGet, amountGet, tokenGive, amountGive)
      .send({ from: account })
      .on('transactionHash', (hash:any) => {
        dispatch(buyOrderMaking())
      })
      .on('error', (error:any) => {
        console.error(error)
        window.alert(`There was an error!`)
      })
  }

  
  export const makeSellOrder = ( exchange:Contract,
    token :Contract,
    web3 :Web3,
    order :Order,
    account:string): AppThunk => async(
    dispatch,
    getState
  ) => {
    const tokenGet = ETHER_ADDRESS
    const amountGet = web3.utils.toWei(
      (order.amount.toNumber() * order.price).toString(),
      'ether',
    )
    const tokenGive = token.options.address
    const amountGive = web3.utils.toWei(order.amount, 'ether')
  
    exchange.methods
      .makeOrder(tokenGet, amountGet, tokenGive, amountGive)
      .send({ from: account })
      .on('transactionHash', (hash:any) => {
        dispatch(sellOrderMaking())
      })
      .on('error', (error:any) => {
        console.error(error)
        window.alert(`There was an error!`)
      })
  }
  

  const exchangeReducer=exchangeSlice.reducer

  export default exchangeReducer
  
