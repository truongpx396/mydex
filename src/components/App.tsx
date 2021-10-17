import React, { useEffect } from 'react'
import './App.css'
import Navbar from './Navbar'
import Content from './Content'
import { connect } from 'react-redux'
import { Dispatch } from 'redux';

import { useAppDispatch,useAppSelector } from '../store/hooks'


import { loadWeb3,loadAccount } from '../store/reducers/web3Reducer'
import { loadToken } from '../store/reducers/tokenReducer'
import { loadExchange } from '../store/reducers/exchangeReducer'
import { Contract } from 'web3-eth-contract';

import Web3 from 'web3'
import { contractsLoadedSelector } from '../store/reducers/exchangeReducer'

const App = () => {
  const dispatch=useAppDispatch()
  const contractsLoaded=useAppSelector(contractsLoadedSelector)

  useEffect(() => {
    const loadBlockchainData = async () => {
      const web3 = await dispatch(loadWeb3())
      const networkId = await web3?.eth.net.getId()
      if( web3 instanceof Web3){
          await loadAccount(web3)
          const token = await dispatch(loadToken( networkId))
          if(token !instanceof Contract) {
            window.alert(
              'Token smart contract not detected on the current network. Please select another network with Metamask.',
            )
            return
          }
          const exchange = await dispatch(loadExchange(networkId))
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

// function mapStateToProps(state: any) {
//   return {
//     contractsLoaded: contractsLoadedSelector(state),
//   }
// }

// export default connect(mapStateToProps)(App)

export default App
