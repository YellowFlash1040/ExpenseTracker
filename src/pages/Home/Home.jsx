import ExpensesMain from "@/components/ExpensesCategories/ExpensesMain"
import welocomeStyles from "../WelcomePage/WelcomePage.module.css"
import homeStyles from "./Home.module.css"
import { ExpensesAndIncomes } from "@/components/ExpensesAndIncomes/ExpensesAndIncomes"
import { Navigate, useParams } from "react-router-dom"
import { TransactionForm } from "@/components/TransactionForm/TransactionForm"
import validTransactionTypes from "@/constants/routes/ValidTransactionTypes"

const Home = () => {
  const { transactionsType } = useParams()

  if (transactionsType === "history" || transactionsType === "history/") {
    return <Navigate to='/transactions/history/expenses' />
  } else if (!validTransactionTypes.includes(transactionsType)) {
    return <Navigate to='/transactions/expenses' />
  }

  return (
    <div className={homeStyles.contianer}>
      <div className={homeStyles.leftColumn}>
        <section className={homeStyles.hero}>
          <h1 className={welocomeStyles.mainTitle}>
            {transactionsType === "expenses" ? "Expense" : "Incomes"} Log
          </h1>
          <p className={welocomeStyles.mainDescription}>
            {transactionsType === "expenses"
              ? "  Capture and organize every penny spent with ease! A clear view of your financial habits at your fingertips."
              : "Track and celebrate every bit of earnings effortlessly! Gain insights into your total revenue in a snap."}
          </p>
        </section>
        <section>
          <h2 className='visually-hidden'>Incomes and expenses</h2>
          <ExpensesAndIncomes />
        </section>
        <section className={homeStyles.mobileForm}>
          <TransactionForm />
        </section>
        <section>
          <ExpensesMain />
        </section>
      </div>
      <section className={homeStyles.desktopForm}>
        <TransactionForm />
      </section>
    </div>
  )
}

export default Home
