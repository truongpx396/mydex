export default interface OrderBook {
    id:number,
    tokenGive:string
    amountTokeGive: number,
    tokenGet: string,
    amountTokenGet: number,
    orderType:string,
    user:string,
    userFill:string,
    timestamp:number
  }