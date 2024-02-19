import TransactionType from "../TransactionType"

const validTransactionTypes = Object.values(TransactionType).map(
  value => value + "s",
)

export default validTransactionTypes
