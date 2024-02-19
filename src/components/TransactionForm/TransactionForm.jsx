import styles from "./TransactonForm.module.css"
import stylesIcon from "./TimePicker/Icon.module.css"

import TransactionType from "../../constants/TransactionType"
import { useState } from "react"
import clsx from "clsx"
import TransactionFormActionType from "../../constants/TransactionFormActionType"
import CurrencyType from "../../constants/CurrencyType"
import { CategoriesModal } from "../CategoriesModal/CategoriesModal"
import { Modal } from "../Modal/Modal"
import { Controller, useForm } from "react-hook-form"
import TransactionFormFields from "../../constants/TransactionFormFields"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import TimePicker from "rc-time-picker"
import "rc-time-picker/assets/index.css"
import { Icon } from "./TimePicker/Icon"
import moment from "moment"
import "./TimePicker/TimePicker.css"
import { useDispatch } from "react-redux"
import { createTransactionThunk } from "@/redux/transactions/operations"

import icons from "icons/icons.svg"

import { DatePickerFormField as DatePicker } from "../DatePickerFormField/DatePickerFormField"
import datePickerStyles from "./DatePicker/DatePicker.module.css"
import { format } from "date-fns"
import { toast } from "react-toastify"

import Clock from "icons/Clock.svg?react"
import CalendarAccent from "icons/CalendarAccent.svg?react"

export const TransactionForm = ({
  actionType = TransactionFormActionType.Add,
  TransactionType: Type = TransactionType.Expense,
  Date: TransactionDate = new Date().toISOString().split("T")[0],
  Time = moment(),
  // Time = new Date()
  //   .toISOString()
  //   .split("T")[1]
  //   .split(":")
  //   .slice(0, 2)
  //   .join(":"),
  Category = { _id: "", categoryName: "" },
  Sum = "",
  Comment = "",
  currency = CurrencyType.UAH,
  onSubmit = data => console.log(data),
}) => {
  const dispatch = useDispatch()

  const [isModalWindowOpened, setIsModalWindowOpened] = useState(false)
  const [activeCategory, setActiveCategory] = useState(Category._id)

  const schema = yup.object({
    [TransactionFormFields.TransactionType]: yup.string().required(),
    [TransactionFormFields.Date]: yup.string().required(),
    [TransactionFormFields.Time]: yup.string().required(),
    [TransactionFormFields.Category]: yup.string().required(),
    [TransactionFormFields.Sum]: yup
      .number()
      .transform((value, originalValue) => {
        return originalValue === "" ? undefined : value
      })
      .typeError("The value must be a number")
      .required()
      .min(1, "Number must be greater than or equal to 1")
      .max(1_000_000, "Number must be less than or equal to 1 million"),
    [TransactionFormFields.Comment]: yup.string().required().min(3).max(48),
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    trigger,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      [TransactionFormFields.TransactionType]: Type,
      Date: TransactionDate,
      Time: typeof Time === "object" ? Time : moment(Time, "HH:mm"), // if I receieve a moment object than I can use it, but if not then I need to create one using moment() method
      // Time,
      Category: Category.categoryName,
      Sum,
      Comment,
    },
    resolver: yupResolver(schema),
  })

  const handleCategoryFieldOnClickOnFocus = () => {
    const categoryTextBox = document.getElementById("categoryTextBox")
    categoryTextBox.blur()

    setIsModalWindowOpened(true)
  }

  const convertData = data => {
    const time = data.Time.split(":").slice(0, 2).join(":")

    const convertedData = {
      type: data.TransactionType + "s",
      date: data.Date,
      time,
      // time: data.Time,
      category: activeCategory,
      sum: parseInt(data.Sum),
      comment: data.Comment,
    }

    return convertedData
  }

  const handleTransactionFormOnSubmit = data => {
    //10:30:23 GMT+1
    const fullTime = data.Time.split(" ")
    data.Time = fullTime[fullTime.length - 2]

    data = convertData(data)

    if (actionType === TransactionFormActionType.Add) {
      // alert("New transaction was added");
      // console.log(data);

      dispatch(createTransactionThunk(data))
        .unwrap()
        .then(() => {
          toast.success("New transaction added successfully!")
          resetForm()
        })
        .catch(error => toast.error(error))
    } else if (actionType === TransactionFormActionType.Save) {
      // alert("New transaction was saved");
      // console.log(data);
      toast.success("Transaction changes saved successfully!")

      onSubmit(data)
    }
  }

  const resetForm = () => {
    const lastTransaction_TransactionType = getValues(
      TransactionFormFields.TransactionType,
    )

    reset()

    setValue(TransactionFormFields.Date, new Date().toISOString().split("T")[0])
    setValue(TransactionFormFields.Time, moment())
    setValue(
      TransactionFormFields.TransactionType,
      lastTransaction_TransactionType,
    )
  }

  const handleApproveCategory = category => {
    setIsModalWindowOpened(false)
    setActiveCategory(category.id)
    setValue(TransactionFormFields.Category, category.name)

    if (errors[TransactionFormFields.Category]) {
      trigger()
    }
  }

  const handleDeleteCategory = id => {
    if (id === activeCategory) {
      setActiveCategory("")
      setValue(TransactionFormFields.Category, "")
    }
  }

  const handleEditCategory = (category, newCategory) => {
    // console.log("Old category: ", category);
    // console.log("New category: ", newCategory);
    const categoryName = getValues(TransactionFormFields.Category)
    if (category.name === categoryName) {
      setValue(TransactionFormFields.Category, newCategory.name)
    }
  }

  const handleChangeType = () => {
    setValue(TransactionFormFields.Category, "")
  }

  return (
    <>
      <div className={styles.transactionFormContainer}>
        <form
          className={styles.transactionForm}
          onSubmit={handleSubmit(handleTransactionFormOnSubmit)}
        >
          {/* Radio buttons */}
          <div className={styles.radioButtonsContainer}>
            <label className={styles.label}>
              <input
                className={styles.hiddenRadioButton}
                type='radio'
                name={TransactionFormFields.TransactionType}
                value={TransactionType.Expense}
                {...register(TransactionFormFields.TransactionType)}
                onChange={() => handleChangeType()}
              />
              <span className={styles.customRadioButton}></span>
              <span>Expense</span>
            </label>
            <label className={styles.label}>
              <input
                className={styles.hiddenRadioButton}
                type='radio'
                name={TransactionFormFields.TransactionType}
                value={TransactionType.Income}
                {...register(TransactionFormFields.TransactionType)}
                onChange={() => handleChangeType()}
              />
              <span className={styles.customRadioButton}></span>
              <span>Income</span>
            </label>
          </div>
          {/* Date and time */}
          <div className={styles.dateAndTimeContainer}>
            <div className={styles.fieldContainer}>
              <label>Date</label>
              <Controller
                name={TransactionFormFields.Date}
                control={control}
                render={({ field }) => (
                  <DatePicker
                    className={datePickerStyles.inputField}
                    value={field.value}
                    onChange={value => {
                      field.onChange(format(value, "yyyy-MM-dd"))
                    }}
                    icon={<CalendarAccent className={styles.calendarIcon} />}
                  />
                )}
              />
            </div>
            <div className={styles.fieldContainer}>
              <label>Time</label>
              <Controller
                name={TransactionFormFields.Time}
                control={control}
                render={({ field }) => (
                  <TimePicker
                    clearIcon={
                      <Clock
                        className={clsx(
                          stylesIcon.timeFieldIcon,
                          styles.calendarIcon,
                        )}
                      />
                    }
                    value={field.value}
                    onChange={value => {
                      if (value === null) {
                        value = moment("00:00", "HH:mm")
                      }
                      field.onChange(value)
                    }}
                  />
                )}
              />
              {/* <input type="time" {...register(TransactionFormFields.Time)} /> */}
            </div>
          </div>
          {/* Category */}
          <div className={styles.fieldContainer}>
            <label>Category</label>
            <input
              className={clsx(styles.sharedTextFieldStyles, styles.sumField, {
                [styles.errorBorder]: errors[TransactionFormFields.Category],
              })}
              type='text'
              placeholder='Different'
              autoComplete='off'
              id='categoryTextBox'
              onClick={handleCategoryFieldOnClickOnFocus}
              onFocus={handleCategoryFieldOnClickOnFocus}
              {...register(TransactionFormFields.Category)}
            ></input>
            {/* Category Validation error */}
            {errors[TransactionFormFields.Category] && (
              <>
                <p className={styles.error}>
                  {errors[TransactionFormFields.Category]?.message}
                </p>
                <svg className={styles.errorIcon} width='20px' height='20px'>
                  <use href={`${icons}#icon-error`}></use>
                </svg>
              </>
            )}
          </div>
          {/* Sum */}
          <div className={styles.fieldContainer}>
            <label>Sum</label>
            <input
              className={clsx(styles.sharedTextFieldStyles, styles.sumField, {
                [styles.errorBorder]: errors[TransactionFormFields.Sum],
              })}
              type='text'
              placeholder='Enter the sum'
              autoComplete='off'
              {...register(TransactionFormFields.Sum)}
            />
            <span className={styles.currencyLabel}>{currency}</span>

            {/* Sum Validation error */}
            {errors[TransactionFormFields.Sum] && (
              <>
                <p className={styles.error}>
                  {errors[TransactionFormFields.Sum]?.message}
                </p>
                <svg
                  className={styles.sumFieldErrorIcon}
                  width='20px'
                  height='20px'
                >
                  <use href={`${icons}#icon-error`}></use>
                </svg>
              </>
            )}
          </div>
          {/* Comment */}
          <div className={styles.fieldContainer}>
            <label>Comment</label>
            <div className={clsx(styles.commentFieldWrapper)}>
              <textarea
                className={clsx(
                  styles.textArea,
                  styles.sharedTextFieldStyles,
                  styles.commentField,
                  {
                    [styles.errorBorder]: errors[TransactionFormFields.Comment],
                  },
                )}
                name='comment'
                id='commentTextBox'
                placeholder='Enter the text'
                {...register(TransactionFormFields.Comment)}
              ></textarea>

              {/* Comment Validation error */}
              {errors[TransactionFormFields.Comment] && (
                <>
                  <p className={styles.error}>
                    {errors[TransactionFormFields.Comment]?.message}
                  </p>
                  <svg
                    className={styles.textAreaErrorIcon}
                    width='20px'
                    height='20px'
                  >
                    <use href={`${icons}#icon-error`}></use>
                  </svg>
                </>
              )}
            </div>
          </div>
          {/* Send */}
          <button className={styles.sendButton} type='submit'>
            {actionType}
          </button>
        </form>
      </div>
      <Modal
        isOpened={isModalWindowOpened}
        onClose={() => setIsModalWindowOpened(false)}
        zIndex={3}
      >
        <CategoriesModal
          transactionType={getValues(TransactionFormFields.TransactionType)}
          approveCategory={handleApproveCategory}
          removeCategory={handleDeleteCategory}
          onEditCategory={handleEditCategory}
        />
      </Modal>
    </>
  )
}
