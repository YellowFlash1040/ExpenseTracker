import clsx from "clsx"
import styles from "./WidgetContainer.module.css"
import { useNavigate } from "react-router-dom"

export const WidgetContainer = ({ className, children, moneyDeal }) => {
  const navigate = useNavigate()

  const handle = () => {
    // console.log(moneyDeal);
    if (moneyDeal === "expenses" || moneyDeal === "incomes")
      navigate(`/transactions/${moneyDeal}`)
  }

  return (
    <article
      className={clsx(styles.widgetContainer, className)}
      onClick={() => handle()}
    >
      {children}
    </article>
  )
}
