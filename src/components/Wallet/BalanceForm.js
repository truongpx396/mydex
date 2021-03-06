import React from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import {
  depositEther,
  depositToken,
  withdrawEther,
  withdrawToken,
} from '../../store/actions/wallet'

import {
  etherDepositAmountChanged,
  etherWithdrawAmountChanged,
  tokenDepositAmountChanged,
  tokenWithdrawAmountChanged,
} from '../../store/actions/wallet'

import { ensureNotNaN } from '../../helpers'

const BalanceForm = (props) => {
  return (
    <Tabs defaultActiveKey="deposit" className="bg-dark text-white">
      <Tab eventKey="deposit" title="Deposit" className="bg-dark">
        <TabContent {...props} isDeposite />
      </Tab>

      <Tab eventKey="withdraw" title="Withdraw" className="bg-dark">
        <TabContent {...props} isDeposite={false} />
      </Tab>
    </Tabs>
  )
}

const TabContent = ({
  isDeposite,
  dispatch,
  exchange,
  web3,
  account,
  etherBalance,
  tokenBalance,
  exchangeEtherBalance,
  exchangeTokenBalance,
  etherDepositAmount,
  token,
  tokenDepositAmount,
  etherWithdrawAmount,
  tokenWithdrawAmount,
}) => {
  return (
    <>
      <table className="table table-dark table-sm small">
        <thead className="text-muted">
          <tr>
            <th>Token</th>
            <th>Wallet</th>
            <th>Exchange</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ETH</td>
            <td>{ensureNotNaN(etherBalance)}</td>
            <td>{ensureNotNaN(exchangeEtherBalance)}</td>
          </tr>
          <tr>
            <td>DAPP</td>
            <td>{ensureNotNaN(tokenBalance)}</td>
            <td>{ensureNotNaN(exchangeTokenBalance)}</td>
          </tr>
        </tbody>
      </table>

      <form
        className="row"
        onSubmit={(event) => {
          event.preventDefault()
          isDeposite
            ? depositEther(
                dispatch,
                exchange,
                web3,
                etherDepositAmount,
                account,
              )
            : withdrawEther(
                dispatch,
                exchange,
                web3,
                etherWithdrawAmount,
                account,
              )
        }}
      >
        <div className="col-12 col-sm pr-sm-2">
          <div className="input-group input-group-sm mb-3">
            <input
              type="text"
              placeholder="Amount"
              value={isDeposite ? etherDepositAmount : etherWithdrawAmount}
              onChange={(e) =>
                isDeposite
                  ? dispatch(etherDepositAmountChanged(e.target.value))
                  : dispatch(etherWithdrawAmountChanged(e.target.value))
              }
              className="form-control form-control-sm bg-dark text-white"
              required
            />
            <div className="input-group-append">
              <span className="input-group-text" id="inputGroup-sizing-sm">
                {'ETH'}
              </span>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-auto pl-sm-0">
          <button
            type="submit"
            className={`btn ${
              isDeposite ? 'btn-primary' : 'btn-info'
            } btn-block btn-sm`}
          >
            {isDeposite ? 'Deposit' : 'Withdraw'}
          </button>
        </div>
      </form>

      <form
        className="row"
        onSubmit={(event) => {
          event.preventDefault()
          isDeposite
            ? depositToken(
                dispatch,
                exchange,
                web3,
                token,
                tokenDepositAmount,
                account,
              )
            : withdrawToken(
                dispatch,
                exchange,
                web3,
                token,
                tokenWithdrawAmount,
                account,
              )
        }}
      >
        <div className="col-12 col-sm pr-sm-2">
          <div className="input-group input-group-sm mb-3">
            <input
              type="text"
              placeholder="Amount"
              value={isDeposite ? tokenDepositAmount : tokenWithdrawAmount}
              onChange={(e) =>
                isDeposite
                  ? dispatch(tokenDepositAmountChanged(e.target.value))
                  : dispatch(tokenWithdrawAmountChanged(e.target.value))
              }
              className="form-control form-control-sm bg-dark text-white"
              required
            />
            <div className="input-group-append">
              <span className="input-group-text" id="inputGroup-sizing-sm">
                {'DAPP'}
              </span>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-auto pl-sm-0">
          <button
            type="submit"
            className={`btn ${
              isDeposite ? 'btn-primary' : 'btn-info'
            } btn-block btn-sm`}
          >
            {isDeposite ? 'Deposit' : 'Withdraw'}
          </button>
        </div>
      </form>
    </>
  )
}

export default BalanceForm
