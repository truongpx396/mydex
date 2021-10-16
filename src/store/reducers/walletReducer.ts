import { Action, combineReducers } from 'redux'
import { createSlice, PayloadAction ,createAsyncThunk,createSelector} from '@reduxjs/toolkit'
import Web3 from 'web3'
import  { RootState,AppThunk } from '../configureStore'
import { Contract } from 'web3-eth-contract';
import Exchange from '../../abis/Exchange.json'
import { AbiItem } from 'web3-utils';
import { ETHER_ADDRESS } from '../../helpers'
import {etherBalanceLoaded} from './web3Reducer' 
import {tokenBalanceLoaded} from './tokenReducer'
import BN from 'bn.js'
import { formatBalance, ensureNotNull } from '../../helpers'

// function wallet(state = {}, action) {
//   let index, data

//   switch (action.type) {
  
//     case 'EXCHANGE_ETHER_BALANCE_LOADED':
//       return { ...state, etherBalance: action.balance }
//     case 'EXCHANGE_TOKEN_BALANCE_LOADED':
//       return { ...state, tokenBalance: action.balance }
//     case 'BALANCES_LOADING':
//       return { ...state, balancesLoading: true }
//     case 'BALANCES_LOADED':
//       return {
//         ...state,
//         balancesLoading: false,
//         etherDepositAmount: null,
//         etherWithdrawAmount: null,
//         tokenDepositAmount: null,
//         tokenWithdrawAmount: null,
//       }
//     case 'ETHER_DEPOSIT_AMOUNT_CHANGED':
//       return { ...state, etherDepositAmount: action.amount }
//     case 'ETHER_WITHDRAW_AMOUNT_CHANGED':
//       return { ...state, etherWithdrawAmount: action.amount }
//     case 'TOKEN_DEPOSIT_AMOUNT_CHANGED':
//       return { ...state, tokenDepositAmount: action.amount }
//     case 'TOKEN_WITHDRAW_AMOUNT_CHANGED':
//       return { ...state, tokenWithdrawAmount: action.amount }

//     default:
//       return state
//   }
// }

interface WalletState {
    etherBalance : string,
    tokenBalance: string,
    balancesLoading: boolean,
    etherDepositAmount: number,
    etherWithdrawAmount: number,
    tokenDepositAmount: number,
    tokenWithdrawAmount: number,
  }

  const initialState: WalletState = {
    etherBalance : '',
    tokenBalance: '',
    balancesLoading: false,
    etherDepositAmount: 0,
    etherWithdrawAmount: 0,
    tokenDepositAmount: 0,
    tokenWithdrawAmount: 0,
  }
  
  export const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        exchangeEtherBalanceLoaded:(state,action :PayloadAction<string>)=>{
            state.etherBalance=action.payload
        },
        exchangeTokenBalanceLoaded:(state,action:PayloadAction<string>)=>{
            state.tokenBalance=action.payload
        },
        balancesLoading: (state) => {
        state.balancesLoading=true
        },
        balancesLoaded: (state) => {
            state.balancesLoading=false
            state.etherDepositAmount=0
            state.etherWithdrawAmount=0
            state.tokenDepositAmount=0
            state.tokenWithdrawAmount=0
        },
        etherDepositAmountChanged:(state,action:PayloadAction<number>)=>{
            state.etherDepositAmount=action.payload
        },
        etherWithdrawAmountChanged:(state,action:PayloadAction<number>)=>{
            state.etherWithdrawAmount=action.payload
        },
        tokenDepositAmountChanged:(state,action:PayloadAction<number>)=>{
            state.tokenDepositAmount=action.payload
        },
        tokenWithdrawAmountChanged:(state,action:PayloadAction<number>)=>{
            state.tokenWithdrawAmount=action.payload
        },
    },
    extraReducers: (builder) => {
      builder
        // .addCase(incrementAsync.pending, (state) => {
        //   state.status = 'loading';
        // })
    },
  })
  
  export const { exchangeEtherBalanceLoaded, exchangeTokenBalanceLoaded,balancesLoading,balancesLoaded,etherDepositAmountChanged,etherWithdrawAmountChanged ,tokenDepositAmountChanged,tokenWithdrawAmountChanged} = walletSlice.actions
  
  // Other code such as selectors can use the imported `RootState` type

  export const exchangeEtherBalanceSelector = (state: RootState) => state.wallet.etherBalance
  export const exchangeTokenBalanceSelector = (state: RootState) => state.wallet.tokenBalance
  export const balancesLoadingSelector = (state: RootState) => state.wallet.balancesLoading
  export const etherDepositAmount = (state: RootState) => state.wallet.etherDepositAmount
  export const etherWithdrawAmount = (state: RootState) => state.wallet.etherWithdrawAmount
  export const tokenDepositAmount = (state: RootState) => state.wallet.tokenDepositAmount
  export const tokenWithdrawAmount = (state: RootState) => state.wallet.tokenWithdrawAmount


export const etherDepositAmountSelector = createSelector(
  etherDepositAmount,
  (amount) => ensureNotNull(amount),
)

export const etherWithdrawAmountSelector = createSelector(
  etherWithdrawAmount,
  (amount) => ensureNotNull(amount),
)

export const tokenDepositAmountSelector = createSelector(
  tokenDepositAmount,
  (amount) => ensureNotNull(amount),
)

export const tokenWithdrawAmountSelector = createSelector(
  tokenWithdrawAmount,
  (amount) => ensureNotNull(amount),
)

  
const walletReducer=walletSlice.reducer

export default walletReducer


 export const loadBalances = (web3 :Web3,
        exchange :Contract,
        token :Contract,
        account: string): AppThunk => async(
        dispatch,
        getState
      ) => {
    if (typeof account !== 'undefined') {
      // Ether balance in wallet
      const etherBalance = await web3.eth.getBalance(account)
      dispatch(etherBalanceLoaded(etherBalance))
  
      // Token balance in wallet
      const tokenBalance = await token.methods.balanceOf(account).call()
      dispatch(tokenBalanceLoaded(tokenBalance))
  
      // Ether balance in exchange
      const exchangeEtherBalance = await exchange.methods
        .balanceOf(ETHER_ADDRESS, account)
        .call()
      dispatch(exchangeEtherBalanceLoaded(exchangeEtherBalance))
  
      // Token balance in exchange
      const exchangeTokenBalance = await exchange.methods
        .balanceOf(token.options.address, account)
        .call()
      dispatch(exchangeTokenBalanceLoaded(exchangeTokenBalance))
  
      // Trigger all balances loaded
      dispatch(balancesLoaded())
    } else {
      window.alert('Please login with MetaMask')
    }
  }


  export const depositEther = (exchange :Contract, web3:Web3, amount:BN, account:string): AppThunk => async(
    dispatch,
    getState
  ) => {
    exchange.methods
      .depositEther()
      .send({ from: account, value: web3.utils.toWei(amount, 'ether') })
      .on('transactionHash', (hash :any) => {
        dispatch(balancesLoading())
      })
      .on('error', (error:any) => {
        console.error(error)
        window.alert(`There was an error!`)
      })
  }

  
  export const withdrawEther = (exchange :Contract, web3: Web3, amount :BN, account:string): AppThunk => async(
    dispatch,
    getState
  ) => {
    exchange.methods
      .withdrawEther(web3.utils.toWei(amount, 'ether'))
      .send({ from: account })
      .on('transactionHash', (hash:any) => {
        dispatch(balancesLoading())
      })
      .on('error', (error:any) => {
        console.error(error)
        window.alert(`There was an error!`)
      })
  }

  
  export const depositToken = (exchange :Contract,
    web3 :Web3,
    token :Contract,
    amount :BN,
    account:string): AppThunk => async(
    dispatch,
    getState
  ) => {
    amount = web3.utils.toWei(amount, 'ether')
  
    token.methods
      .approve(exchange.options.address, amount)
      .send({ from: account })
      .on('transactionHash', (hash:any) => {
        exchange.methods
          .depositToken(token.options.address, amount)
          .send({ from: account })
          .on('transactionHash', (hash:any) => {
            dispatch(balancesLoading())
          })
          .on('error', (error:any) => {
            console.error(error)
            window.alert(`There was an error!`)
          })
      })
  }

  
  export const withdrawToken = (exchange :Contract,
    web3 :Web3,
    token :Contract,
    amount :BN,
    account :string): AppThunk => async(
    dispatch,
    getState
  ) => {
    exchange.methods
      .withdrawToken(token.options.address, web3.utils.toWei(amount, 'ether'))
      .send({ from: account })
      .on('transactionHash', (hash:any) => {
        dispatch(balancesLoading())
      })
      .on('error', (error:any) => {
        console.error(error)
        window.alert(`There was an error!`)
      })
  }
  
  