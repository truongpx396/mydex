import Web3 from 'web3'
import Token from '../../abis/Token.json'
import Exchange from '../../abis/Exchange.json'
import * as Actions from '../consts'
import { Dispatch } from 'redux';
import { AbiItem } from 'web3-utils';
import { Contract } from 'web3-eth-contract';

// const getKeyValue = <T extends object, U extends keyof T>(obj: T) => (key: U) =>
//   obj[key];

// declare global {
//     interface Window {
//       ethereum:any;
//       __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ :any;
//     }
// }


// // WEB3
// // export function web3Loaded(connection :Web3) {
// //   return {
// //     type: Actions.WEB3_LOADED,
// //     connection,
// //   }
// // }

// // export const loadWeb3 = async (dispatch:Dispatch) : Promise<Web3 | undefined>  => {
// //   if (typeof window.ethereum !== 'undefined') {
// //     const web3 = new Web3(window.ethereum)
// //     dispatch(web3Loaded(web3))
// //     return web3
// //   } else {
// //     window.alert('Please install MetaMask')
// //     window.location.assign('https://metamask.io/')
// //   }
// // }

// // WEB3 ACCOUNT
// export function web3AccountLoaded(account:String) {
//   return {
//     type: Actions.WEB3_ACCOUNT_LOADED,
//     account,
//   }
// }

// export const loadAccount = async (web3:Web3, dispatch:Dispatch) => {
//   const accounts = await web3.eth.getAccounts()
//   const account = accounts[0]
//   dispatch(web3AccountLoaded(account))
//   return account
// }

// // TOKEN
// export function tokenLoaded(contract:Contract) {
//   return {
//     type: Actions.TOKEN_LOADED,
//     contract,
//   }
// }

// export const loadToken = async (web3 :Web3, networkId:any, dispatch:Dispatch) => {
//   try {
//     const token = new web3.eth.Contract(
//       Token.abi as AbiItem[],
//       //Token.networks[networkId].address,
//       getKeyValue(Token.networks)(networkId).address
//     )
//     dispatch(tokenLoaded(token))
//     return token
//   } catch (error) {
//     console.log(
//       'Contract not deployed to the current network. Please select another network with Metamask.',
//     )
//     return null
//   }
// }

// // EXCHANGE
// export function exchangeLoaded(contract:Contract) {
//   return {
//     type: Actions.EXCHANGE_LOADED,
//     contract,
//   }
// }



// export const loadExchange = async (web3 :Web3, networkId:any, dispatch:Dispatch) => {
//   try {
//     const exchange = new web3.eth.Contract(
//       Exchange.abi as AbiItem[],
//       //Exchange.networks[networkId].address,
//       getKeyValue(Exchange.networks)(networkId).address
//     )
//     dispatch(exchangeLoaded(exchange))
//     return exchange
//   } catch (error) {
//     console.log(
//       'Contract not deployed to the current network. Please select another network with Metamask.',
//     )
//     return null
//   }
// }
