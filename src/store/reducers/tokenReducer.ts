import { createSlice, PayloadAction ,createSelector} from '@reduxjs/toolkit'
import  { RootState,AppThunk,getKeyValue } from '../configureStore'
import { Contract } from 'web3-eth-contract';
import Token from '../../abis/Token.json'
import { AbiItem } from 'web3-utils';
import { formatBalance, ensureNotNull } from '../../helpers'


// function token(state = {}, action) {
//   switch (action.type) {
//     case 'TOKEN_LOADED':
//       return { ...state, loaded: true, contract: action.contract }
//     case 'TOKEN_BALANCE_LOADED':
//       return { ...state, balance: action.balance }
//     default:
//       return state
//   }
// }

// export const loadToken = async (web3 :Web3, networkId:any, dispatch:Dispatch) => {
//     try {
//       const token = new web3.eth.Contract(
//         Token.abi as AbiItem[],
//         //Token.networks[networkId].address,
//         getKeyValue(Token.networks)(networkId).address
//       )
//       dispatch(tokenLoaded(token))
//       return token
//     } catch (error) {
//       console.log(
//         'Contract not deployed to the current network. Please select another network with Metamask.',
//       )
//       return null
//     }
//   }

  export const loadToken = (networkId:any): AppThunk => async(
    dispatch,
    getState
  ) => {
    try {
        const token = new Contract(
          Token.abi as AbiItem[],
          //Token.networks[networkId].address,
          getKeyValue(Token.networks)(networkId).address
        )
        dispatch(tokenLoaded(token))
        return token
      } catch (error) {
        console.log(
          'Contract not deployed to the current network. Please select another network with Metamask.',
        )
      }
  };

interface TokenState {
    contract: Contract | undefined,
    loaded: boolean,
    balance: string,
    status: 'idle' | 'loading' | 'failed';
  }

  const initialState: TokenState = {
    contract:undefined,
    loaded:false,
    balance:'',
    status: 'idle',
  }
  
  export const tokenSlice = createSlice({
    name: 'token',
    initialState,
    reducers: {
      tokenLoaded: (state, action: PayloadAction<Contract>) => {
        state.contract=action.payload
        state.loaded=true
      },
      tokenBalanceLoaded: (state, action: PayloadAction<string>) => {
        state.balance = action.payload
      },
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
  
  export const { tokenLoaded, tokenBalanceLoaded } = tokenSlice.actions
  
  // Other code such as selectors can use the imported `RootState` type
  export const tokenSelector = (state: RootState) => state.token.contract

  export const tokenLoadedSelector = (state: RootState) => state.token.loaded
  
  export const tokenBalance= (state: RootState) => state.token.balance

  export const tokenBalanceSelector = createSelector(tokenBalance, (balance) => {
    return ensureNotNull(formatBalance(balance))
  })

  const tokenReducer=tokenSlice.reducer

  export default tokenReducer
  