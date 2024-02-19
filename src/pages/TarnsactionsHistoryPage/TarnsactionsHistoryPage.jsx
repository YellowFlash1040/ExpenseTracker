import { Navigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectTransactionsTotal } from "@/redux/transactions/slice"
import {
  TransactionsList,
  TransactionsSearchTools,
  WidgetContainer,
} from "@/components"

import styles from "./TarnsactionsHistoryPage.module.css"
import { TransactionsTotal } from "@/components/TransactionsTotal/TransactionsTotal"
import clsx from "clsx"
import validTransactionTypes from "@/constants/routes/ValidTransactionTypes"

const TarnsactionsHistoryPage = () => {
  const { transactionsType } = useParams()
  const { expenses, incomes } = useSelector(selectTransactionsTotal)

  if (!validTransactionTypes.includes(transactionsType)) {
    return <Navigate to='/transactions/history/expenses' />
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderContent}>
          <h1 className={styles.pageTitle}>
            {transactionsType === "expenses" ? "All Expense" : "All Income"}
          </h1>
          <p
            className={clsx(styles.pageParagraph, {
              [styles.pageExpensesParagraph]: transactionsType === "expenses",
              [styles.pageIncomesParagraph]: transactionsType === "incomes",
            })}
          >
            {transactionsType === "expenses"
              ? "View and manage every transaction seamlessly! Your entire financial landscape, all in one place."
              : "Track and celebrate every bit of earnings effortlessly! Gain insights into your total revenue in a snap."}
          </p>
        </div>

        <div className={styles.totalStatistics}>
          <TransactionsTotal
            title='All Income'
            amount={incomes}
            className={styles.statisticsBlock}
          />
          <TransactionsTotal
            title='All Expense'
            amount={expenses}
            className={styles.statisticsBlock}
          />
        </div>
      </div>

      <WidgetContainer className={styles.transactionListContainer}>
        <TransactionsSearchTools />
        <TransactionsList />
      </WidgetContainer>
    </>
  )
}

export default TarnsactionsHistoryPage
