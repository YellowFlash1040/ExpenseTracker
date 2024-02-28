import React, { useEffect, useRef, useState } from "react"
import styles from "./UserBarBtnBox.module.css"
import { useSelector } from "react-redux"
import { selectAvatarUrl, selectName } from "@/redux/user/slice"
import clsx from "clsx"
import UserBarIcon from "@/assets/icons/UserBarIcon.svg?react"
import UserBarLogOutIcon from "@/assets/icons/UserBarLogOutIcon.svg?react"
import DropIcon from "@/assets/icons/DropIcon.svg?react"

export const UserBarBtnBox = ({
  onClose,
  setIsVisibleProfile,
  setIsVisibleLogout,
}) => {
  const [rotated, setrotated] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const name = useSelector(selectName)
  const avatar = useSelector(selectAvatarUrl)
  const altText = name ? name[0] : ""
  const handleChangeBar = () => {
    setIsOpen(!isOpen)
    setrotated(prev => !prev)
  }

  const handleProfile = () => {
    onClose(true)
    setIsVisibleProfile(true)
  }

  const handleLogout = () => {
    setIsVisibleLogout(true)
    onClose(true)
  }

  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setrotated(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className={styles.boxAbsolute}>
      <div className={styles.wrapperSummary}>
        {avatar ? (
          <img
            src={avatar ? avatar : undefined}
            alt={altText}
            className={styles.imageUser}
          />
        ) : (
          <span className={styles.spanFirstL}>{altText}</span>
        )}
        <p className={styles.nameUserStyle}>
          {name?.length > 12 ? `${name.slice(0, 10)}...` : name}
        </p>
        <button
          className={clsx({
            [styles.buttonDropDown]: true,
            [styles.rotated]: rotated,
          })}
          onClick={() => handleChangeBar()}
        >
          <DropIcon className={styles.dropIcon} />
        </button>
        <ul
          // className={isOpen ? styles.listDrop : styles.listNone}
          className={clsx(styles.customDropDown, {
            [styles.visibleCustomDropDown]: isOpen,
          })}
          ref={dropdownRef}
        >
          <li className={styles.itemDrop}>
            <button className={styles.buttonStyle} onClick={handleProfile}>
              <UserBarIcon className={styles.iconUserHower} />
              Profile settings
            </button>
          </li>
          <li className={styles.itemDrop}>
            <button className={styles.buttonStyle} onClick={handleLogout}>
              <UserBarLogOutIcon className={styles.iconUserHower} />
              Log out
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}
