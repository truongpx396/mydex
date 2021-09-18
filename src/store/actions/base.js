import Web3 from 'web3'
import Token from '../../abis/Token.json'
import Exchange from '../../abis/Exchange.json'
import * as Actions from '../consts'

// WEB3
export function web3Loaded(connection) {
  return {
    type: Actions.WEB3_LOADED,
    connection,
  }
}

export const loadWeb3 = async (dispatch) => {
  if (typeof window.ethereum !== 'undefined') {
    const web3 = new Web3(window.ethereum)
    dispatch(web3Loaded(web3))
    return web3
  } else {
    window.alert('Please install MetaMask')
    window.location.assign('https://metamask.io/')
  }
}

// WEB3 ACCOUNT
export function web3AccountLoaded(account) {
  return {
    type: Actions.WEB3_ACCOUNT_LOADED,
    account,
  }
}

export const loadAccount = async (web3, dispatch) => {
  const accounts = await web3.eth.getAccounts()
  const account = accounts[0]
  dispatch(web3AccountLoaded(account))
  return account
}

// TOKEN
export function tokenLoaded(contract) {
  return {
    type: Actions.TOKEN_LOADED,
    contract,
  }
}

export const loadToken = async (web3, networkId, dispatch) => {
  try {
    const token = new web3.eth.Contract(
      Token.abi,
      Token.networks[networkId].address,
    )
    dispatch(tokenLoaded(token))
    return token
  } catch (error) {
    console.log(
      'Contract not deployed to the current network. Please select another network with Metamask.',
    )
    return null
  }
}

// EXCHANGE
export function exchangeLoaded(contract) {
  return {
    type: Actions.EXCHANGE_LOADED,
    contract,
  }
}

export const loadExchange = async (web3, networkId, dispatch) => {
  try {
    const exchange = new web3.eth.Contract(
      Exchange.abi,
      Exchange.networks[networkId].address,
    )
    dispatch(exchangeLoaded(exchange))
    return exchange
  } catch (error) {
    console.log(
      'Contract not deployed to the current network. Please select another network with Metamask.',
    )
    return null
  }
}
