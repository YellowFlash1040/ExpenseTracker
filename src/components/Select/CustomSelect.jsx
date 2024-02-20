import React, { useEffect, useRef, useState } from "react"
import styles from "./CustomSelect.module.css"

export const CustomSelect = ({ currency, setCurrency }) => {
  const [showList, setShowList] = useState(false)

  const data = [
    { id: 1, name: "₴ UAH", value: "uah" },
    { id: 2, name: "$ USD", value: "usd" },
    { id: 3, name: "€ EUR", value: "eur" },
  ]

  const current = data.filter(el => {
    if (el.value === currency) return el
  })[0].name

  const handleChange = val => {
    setCurrency(val)
    setShowList(false)
  }

  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowList(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className={styles.customSelectContainer} ref={dropdownRef}>
      <div
        className={
          showList
            ? `${styles.selectedText} ${styles.active}`
            : styles.selectedText
        }
        onClick={() => setShowList(prevState => !prevState)}
      >
        {current}
      </div>
      {showList && (
        <ul className={styles.selectOptions}>
          {data.map(option => {
            return (
              <li
                className={
                  currency === option.value
                    ? `${styles.customSelectOption} ${styles.active}`
                    : styles.customSelectOption
                }
                data-name={option.name}
                key={option.id}
                value={option.value}
                onClick={() => handleChange(option.value)}
              >
                {option.name}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
