import { createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import web3Reducer from './reducers/web3Reducer'
import tokenReducer from './reducers/tokenReducer'
import exchangeReducer from './reducers/exchangeReducer'
import { allOrdersReducer } from './reducers/allOrdersReducer'
import { cancelledOrdersReducer } from './reducers/cancelledOrdersReducer'
import { filledOrdersReducer } from './reducers/filledOrdersReducer'
import walletReducer from './reducers/walletReducer'
import { configureStore,ThunkAction, Action  } from '@reduxjs/toolkit'

export const getKeyValue = <T extends object, U extends keyof T>(obj: T) => (key: U) =>
  obj[key];

  declare global {
    interface Window {
      ethereum:any;
      __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ :any;
    }
}

const loggerMiddleware = createLogger()
const middleware:any[] = []

// For Redux Dev Tools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

// export default store=function configureStore(preloadedState) {
//   return createStore(
//     rootReducer,
//     preloadedState,
//     composeEnhancers(applyMiddleware(...middleware, loggerMiddleware)),
//   )
// }

export const store = configureStore({
  reducer: {
    web3: web3Reducer,
    token: tokenReducer,
    exchange:exchangeReducer,
    cancelledOrders:cancelledOrdersReducer,
    filledOrders:filledOrdersReducer,
    allOrders:allOrdersReducer,
    wallet:walletReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(loggerMiddleware),
  //devTools: process.env.NODE_ENV !== 'production',
  //enhancers: composeEnhancers,
})


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
