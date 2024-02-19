import React, { useEffect } from "react"
import styles from "./styles/ExpensesMain.module.css"
import { useDispatch, useSelector } from "react-redux"
import { fetchTransactionsThunk } from "@/redux/transactions/operations"
import { ExpensesDonut } from "./ExpensesDonut"
import {
  selectTransactions,
  setTransactionsType,
} from "@/redux/transactions/slice"
import randomColor from "randomcolor"
import { ExpensesList } from "./ExpensesList"
import { useParams } from "react-router-dom"

const ExpensesMain = () => {
  const { transactionsType } = useParams()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setTransactionsType(transactionsType))
  }, [dispatch, transactionsType])

  const expenses = useSelector(selectTransactions)
  const categorySums = []
  expenses?.forEach(transaction => {
    const { category, sum } = transaction
    const { categoryName, _id } = category

    let found = false
    categorySums.forEach(item => {
      if (item._id === _id) {
        item.sum += sum
        found = true
      }
    })

    if (!found) {
      categorySums.push({
        _id,
        categoryName,
        sum,
      })
    }
  })

  const colors = randomColor({
    count: Object.keys(categorySums).length,
    hue: "green",
  })
  useEffect(() => {
    dispatch(fetchTransactionsThunk({ type: transactionsType, date: "" }))
  }, [dispatch, transactionsType])

  return (
    <div className={styles.container}>
      {categorySums.length > 0 ? (
        <>
          <p className={styles.text}>
            {transactionsType === "expenses"
              ? "Expenses categories"
              : "Incomes categories"}
          </p>
          <div className={styles.content}>
            <ExpensesDonut data={categorySums} colors={colors} />
            <ExpensesList data={categorySums} colors={colors} />
          </div>
        </>
      ) : (
        <p>No data</p>
      )}
    </div>
  )
}

export default ExpensesMain
