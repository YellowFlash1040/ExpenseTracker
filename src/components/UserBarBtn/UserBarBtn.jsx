import React, { useEffect, useRef, useState } from "react"
import styles from "./UserBarBtn.module.css"
import DropIcon from "@/assets/icons/DropIcon.svg?react"
import UserBarIcon from "@/assets/icons/UserBarIcon.svg?react"
import UserBarLogOutIcon from "@/assets/icons/UserBarLogOutIcon.svg?react"
import clsx from "clsx"
import { useSelector } from "react-redux"
import { selectAvatarUrl, selectName } from "@/redux/user/slice"
import { SureModal } from "../SureModal/SureModal"
import { Modal } from "../Modal/Modal"
import { UserSetsModal } from "../UserSetsModal/UserSetsModal"

export const UserBarBtn = () => {
  const [rotated, setRotated] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const [isVisibleLogout, setIsVisibleLogout] = useState(false)
  const [isVisibleProfile, setIsVisibleProfile] = useState(false)

  const name = useSelector(selectName)
  const avatar = useSelector(selectAvatarUrl)
  const altText = name ? name[0] : ""
  const handleChangeBar = () => {
    setIsOpen(!isOpen)
    setRotated(!rotated)
  }

  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setRotated(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className={styles.boxAbsolute} ref={dropdownRef}>
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
          className={isOpen ? styles.listDrop : styles.listNone}
          ref={dropdownRef}
        >
          <li className={styles.itemDrop}>
            <button
              className={clsx(styles.buttonStyle)}
              onClick={() => {
                setIsOpen(false)
                setRotated(false)
                setIsVisibleProfile(true)
              }}
            >
              <UserBarIcon className={styles.iconUserHower} />
              Profile settings
            </button>
          </li>
          <li className={styles.itemDrop}>
            <button
              className={clsx(styles.buttonStyle)}
              onClick={() => {
                setIsOpen(false)
                setRotated(false)
                setIsVisibleLogout(true)
              }}
            >
              <UserBarLogOutIcon className={styles.iconUserHower} />
              Log out
            </button>
          </li>
        </ul>
        <Modal
          isOpened={isVisibleLogout}
          onClose={() => setIsVisibleLogout(false)}
        >
          <SureModal text={"Log out"} closeModal={setIsVisibleLogout} />
        </Modal>
        <Modal
          isOpened={isVisibleProfile}
          onClose={() => setIsVisibleProfile(false)}
        >
          <UserSetsModal closeModal={setIsVisibleProfile} />
        </Modal>
      </div>
    </div>
  )
}
