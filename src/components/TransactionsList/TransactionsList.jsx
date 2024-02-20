import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useScrollbar } from "@/hooks/ScrollbarHook"

import {
  selectFilteredTransactions,
  selectFiltersDate,
} from "@/redux/transactionsFilters/selectors"
import { fetchTransactionsThunk } from "@/redux/transactions/operations"
import { TransactionsListItem } from "@/components"

import styles from "./TransactionsList.module.css"
import { changeFilterType } from "@/redux/transactionsFilters/slice"
import { selectIsLoading } from "@/redux/transactions/slice"

import { ThreeDots as Loader } from "react-loader-spinner"

export const TransactionsList = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const dataWrapper = useRef(null)
  const { transactionsType } = useParams()
  const transactions = useSelector(selectFilteredTransactions)
  const date = useSelector(selectFiltersDate)
  const hasScroll = true

  useEffect(() => {
    if (transactionsType !== "expenses" && transactionsType !== "incomes") {
      navigate("/", { replace: true })
    } else {
      dispatch(changeFilterType(transactionsType))
      dispatch(fetchTransactionsThunk({ type: transactionsType, date }))
    }
  }, [dispatch, navigate, transactionsType, date])

  useScrollbar(dataWrapper, hasScroll)

  const isLoading = useSelector(selectIsLoading)

  return (
    <div className={styles.TransactionsListWrap} ref={dataWrapper}>
      <table className={styles.transactionsList}>
        <thead className={styles.transactionsListHeader}>
          <tr>
            <th>Category</th>
            <th>Comment</th>
            <th>Date</th>
            <th>Time</th>
            <th>Sum</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className={styles.transactionsListBody}>
          {isLoading ? (
            <tr>
              <div
                style={{
                  width: "100%",
                  position: "absolute",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Loader color='#4fa94d' ariaLabel='three-dots-loading' />
              </div>
            </tr>
          ) : (
            transactions.map(transaction => (
              <TransactionsListItem
                key={transaction._id}
                transaction={transaction}
                transactionType={transactionsType}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
