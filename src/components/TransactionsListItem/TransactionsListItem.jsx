import { useState } from "react"
import { format } from "date-fns"
import { useDispatch, useSelector } from "react-redux"
import clsx from "clsx"

import { selectCurrency } from "@/redux/user/slice"
import {
  createTransactionThunk,
  deleteTransactionThunk,
  updateTransactionThunk,
} from "@/redux/transactions/operations"

import styles from "./TransactionsListItem.module.css"
import EditIcon from "@/assets/icons/EditPensil.svg?react"
import DeleteIcon from "@/assets/icons/DeleteTrash.svg?react"
import { useWindowSizeHook } from "@/hooks/WindowSizeHook"
import { Modal } from "../Modal/Modal"
import { TransactionForm } from "../TransactionForm/TransactionForm"
import { SureModal } from "../SureModal/SureModal"

const trim = (text, windowWidth) => {
  const limit = windowWidth >= 1440 ? 14 : 9

  if (text.length > limit) {
    return `${text.slice(0, limit - 3)}...`
  }

  return text
}

export const TransactionsListItem = ({ transaction, transactionType }) => {
  const dispatch = useDispatch()
  const currency = useSelector(selectCurrency)
  const { windowSize } = useWindowSizeHook()

  const [isOpened, setIsOpened] = useState(false)
  const [isOpenedDel, setIsOpenedDel] = useState(false)

  const handleEditTransaction = data => {
    if (transaction.type !== data.type) {
      dispatch(deleteTransactionThunk(transaction._id))
      dispatch(createTransactionThunk(data))
    } else {
      delete data.type

      dispatch(
        updateTransactionThunk({
          reqData: data,
          id: transaction._id,
          type: transactionType,
        }),
      )
    }

    setIsOpened(false)
  }

  return (
    <tr>
      <td>{trim(transaction.category.categoryName, windowSize.innerWidth)}</td>
      <td>{trim(transaction.comment, windowSize.innerWidth)}</td>
      <td>
        {windowSize.innerWidth < 1440
          ? trim(
              format(transaction.date, "EEEEEE, d.MM.yyyy"),
              windowSize.innerWidth,
            )
          : format(transaction.date, "EEEEEE, d.MM.yyyy")}
      </td>
      <td>
        {windowSize.innerWidth < 1440
          ? trim(transaction.time, windowSize.innerWidth)
          : transaction.time}
      </td>
      <td>{`${transaction.sum} / ${currency?.toUpperCase()}`}</td>
      <td>
        <button
          className={clsx(styles.btn, styles.btnAccent)}
          onClick={() => setIsOpened(true)}
        >
          <EditIcon className={styles.pensilIcon} />
          {windowSize.innerWidth >= 1440 && "Edit"}
        </button>
        <button
          className={clsx(styles.btn, styles.btnDefault)}
          onClick={() => setIsOpenedDel(true)}
        >
          <DeleteIcon className={styles.trashIcon} />
          {windowSize.innerWidth >= 1440 && "Delete"}
        </button>

        <Modal isOpened={isOpened} onClose={() => setIsOpened(false)}>
          <TransactionForm
            actionType='save'
            TransactionType={
              transactionType === "incomes" ? "income" : "expense"
            }
            Date={format(transaction.date, "yyyy-MM-dd")}
            Time={transaction.time}
            Category={{
              _id: transaction.category._id,
              categoryName: transaction.category.categoryName,
            }}
            Sum={transaction.sum}
            Comment={transaction.comment}
            currency={currency}
            onSubmit={handleEditTransaction}
          />
        </Modal>
        <Modal isOpened={isOpenedDel} onClose={() => setIsOpenedDel(false)}>
          <SureModal
            closeModal={setIsOpenedDel}
            text={"Delete"}
            id={transaction._id}
          />
        </Modal>
      </td>
    </tr>
  )
}
