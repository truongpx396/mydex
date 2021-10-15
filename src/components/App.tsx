import React, { useEffect } from 'react'
import './App.css'
import Navbar from './Navbar'
import Content from './Content'
import { connect } from 'react-redux'
import { Dispatch } from 'redux';

import {
  loadWeb3,
  loadAccount,
  loadToken,
  loadExchange,
  web3AccountLoaded,
} from '../store/actions/base'
import { contractsLoadedSelector } from '../store/selectors/base'
import Web3 from 'web3'

const App = ({ dispatch , contractsLoaded }:{dispatch:Dispatch,contractsLoaded:any}) => {
  useEffect(() => {
    const loadBlockchainData = async () => {
      const web3 = await loadWeb3(dispatch)
      const networkId = await web3?.eth.net.getId()
      if( web3 instanceof Web3){
          await loadAccount(web3, dispatch)
          const token = await loadToken(web3, networkId, dispatch)
          if (!token) {
            window.alert(
              'Token smart contract not detected on the current network. Please select another network with Metamask.',
            )
            return
          }
          const exchange = await loadExchange(web3, networkId, dispatch)
          if (!exchange) {
            window.alert(
              'Exchange smart contract not detected on the current network. Please select another network with Metamask.',
            )
            return
          }
      }
      
    }
    loadBlockchainData()
  }, [dispatch])

  return (
    <div>
      <Navbar />
      {contractsLoaded ? <Content /> : <div className="content"></div>}
    </div>
  )
}

function mapStateToProps(state: any) {
  return {
    contractsLoaded: contractsLoadedSelector(state),
  }
}

export default connect(mapStateToProps)(App)
