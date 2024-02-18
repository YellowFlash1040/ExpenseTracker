import styles from "./DecorationTab.module.css"
import ArrowTopRight from "@/assets/icons/ArrowTopRight.svg?react"

export const DecorationTab = () => {
  return (
    <div className={styles.decorationTab}>
      <div className={styles.arrowWrapper}>
        <ArrowTopRight className={styles.arrowTopRight} />
      </div>
      <div>
        <h1 className={styles.text}>Your balance</h1>
        <ul className={styles.incomeList}>
          <li className={styles.income}>&#36;{/* balance */ 671.429}</li>
          <li className={styles.icomePercentage}>
            &#43;{/* percentage */ 25.38}&#37;
          </li>
        </ul>
      </div>
    </div>
  )
}
