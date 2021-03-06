import { get, groupBy, maxBy, minBy } from 'lodash'
import { createSelector } from 'reselect'
import moment from 'moment'
import { decorateOrder } from './base'
import { filledOrdersLoaded, filledOrders } from './trades'

export const priceChartLoadedSelector = createSelector(
  filledOrdersLoaded,
  (loaded) => loaded,
)

export const priceChartSelector = createSelector(filledOrders, (orders) => {
  // Sort orders by date ascending to compare history
  orders = orders.sort((a, b) => a.timestamp - b.timestamp)
  // Decorate orders - add display attributes
  orders = orders.map((o) => decorateOrder(o))
  // Get last 2 order for final price & price change
  let secondLastOrder, lastOrder
  ;[secondLastOrder, lastOrder] = orders.slice(orders.length - 2, orders.length)
  // get last order price
  const lastPrice = get(lastOrder, 'tokenPrice', 0)
  // get second last order price
  const secondLastPrice = get(secondLastOrder, 'tokenPrice', 0)

  return {
    lastPrice,
    lastPriceChange: lastPrice >= secondLastPrice ? '+' : '-',
    series: [
      {
        data: buildGraphData(orders),
      },
    ],
  }
})

const buildGraphData = (orders) => {
  // Group the orders by hour for the graph
  orders = groupBy(orders, (o) =>
    moment.unix(o.timestamp).startOf('hour').format(),
  )
  // Get each hour where data exists
  const hours = Object.keys(orders)
  // Build the graph series
  const graphData = hours.map((hour) => {
    // Fetch all the orders from current hour
    const group = orders[hour]
    // Calculate price values - open, high, low, close
    const open = group[0] // first order
    const high = maxBy(group, 'tokenPrice') // high price
    const low = minBy(group, 'tokenPrice') // low price
    const close = group[group.length - 1] // last order

    return {
      x: new Date(hour),
      y: [open.tokenPrice, high.tokenPrice, low.tokenPrice, close.tokenPrice],
    }
  })

  return graphData
}
