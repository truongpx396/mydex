import { Action, combineReducers } from 'redux'
import { createSlice, PayloadAction ,createAsyncThunk,createSelector} from '@reduxjs/toolkit'
import Web3 from 'web3'
import  { RootState,AppThunk } from '../configureStore'
import { formatBalance, ensureNotNull } from '../../helpers'

// function web3(state = {}, action :Action) {
//   switch (action.type) {
//     case 'WEB3_LOADED':
//       return { ...state, connection: action.connection }
//     case 'WEB3_ACCOUNT_LOADED':
//       return { ...state, account: action.account }
//     case 'ETHER_BALANCE_LOADED':
//       return { ...state, balance: action.balance }
//     default:
//       return state
//   }
// }


// export const loadWeb3 = async (dispatch:Dispatch) : Promise<Web3 | undefined>  => {
//   if (typeof window.ethereum !== 'undefined') {
//     const web3 = new Web3(window.ethereum)
//     dispatch(web3Loaded(web3))
//     return web3
//   } else {
//     window.alert('Please install MetaMask')
//     window.location.assign('https://metamask.io/')
//   }
// }

export const loadWeb3 = (): AppThunk<Promise<Web3|undefined>> => async(
  dispatch,
  getState
) => {
  if (typeof window.ethereum !== 'undefined') {
    const web3 = new Web3(window.ethereum)
    dispatch(web3Loaded(web3))
    return web3
  } else {
    window.alert('Please install MetaMask')
    window.location.assign('https://metamask.io/')
  }
};

// export const loadAccount = async (web3:Web3, dispatch:Dispatch) => {
//   const accounts = await web3.eth.getAccounts()
//   const account = accounts[0]
//   dispatch(web3AccountLoaded(account))
//   return account
// }


export const loadAccount = createAsyncThunk('web3/loadAccount', async(
  web3 :Web3,
 {dispatch}
) => {
  const accounts = await web3.eth.getAccounts()
  const account = accounts[0]
  dispatch(web3AccountLoaded(account))
  return account
})


interface Web3State {
  connection: Web3 | undefined,
  account: string,
  balance: string,
  status: 'idle' | 'loading' | 'failed';
}

// Define the initial state using that type
const initialState: Web3State = {
  connection:undefined,
  account:"",
  balance:'',
  status: 'idle',
}

export const web3Slice = createSlice({
  name: 'web3',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    web3Loaded: (state, action: PayloadAction<Web3>) => {
      state.connection=action.payload
    },
    web3AccountLoaded: (state, action: PayloadAction<string>) => {
      state.account = action.payload
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    etherBalanceLoaded: (state, action: PayloadAction<string>) => {
      state.balance = action.payload
    }
  },
  extraReducers: (builder) => {
    //builder
      // .addCase(incrementAsync.pending, (state) => {
      //   state.status = 'loading';
      // })
      // .addCase(incrementAsync.fulfilled, (state, action) => {
      //   state.status = 'idle';
      //   state.value += action.payload;
      // });
  },
})

export const { web3Loaded, web3AccountLoaded, etherBalanceLoaded } = web3Slice.actions

// Other code such as selectors can use the imported `RootState` type
export const web3Selector = (state: RootState) => state.web3.connection

const etherBalance=(state:RootState) => state.web3.balance

export const etherBalanceSelector = createSelector(etherBalance, (balance) => {
  return ensureNotNull(formatBalance(balance))
})

export const accountSelector = (state: RootState) => state.web3.account

const web3Reducer=web3Slice.reducer

export default web3Reducer
