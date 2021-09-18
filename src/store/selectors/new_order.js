import { get } from 'lodash'
import { createSelector } from 'reselect'

const buyOrder = (state) => get(state, 'exchange.buyOrder', {})
export const buyOrderSelector = createSelector(buyOrder, (order) => order)

const sellOrder = (state) => get(state, 'exchange.sellOrder', {})
export const sellOrderSelector = createSelector(sellOrder, (order) => order)
