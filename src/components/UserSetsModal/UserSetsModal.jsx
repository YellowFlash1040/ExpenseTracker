import React, { useState } from "react"
import styles from "./UserSetsModal.module.css"
import UserBaseImg from "@/assets/icons/UserBaseImg.svg?react"
import { useDispatch, useSelector } from "react-redux"
import { selectAvatarUrl, selectCurrency, selectName } from "@/redux/user/slice"
import { CustomSelect } from "../Select/CustomSelect"
import { toast } from "react-toastify"
import {
  deleteUsersAvatarThunk,
  updateUsersAvatarThunk,
  updateUsersInfoThunk,
} from "@/redux/user/operations"

export const UserSetsModal = ({ closeModal }) => {
  const dispatch = useDispatch()
  const userName = useSelector(selectName)
  const userAvatar = useSelector(selectAvatarUrl)
  const userCurrency = useSelector(selectCurrency)

  const [currency, setCurrency] = useState(userCurrency)
  const [avatar, setAvatar] = useState(userAvatar)
  const [avatarUrl, setAvatarUrl] = useState(userAvatar)
  const [name, setName] = useState(userName)

  const handleSave = async () => {
    try {
      if (name !== userName || currency !== userCurrency)
        await dispatch(updateUsersInfoThunk({ name, currency }))
      if (avatar !== userAvatar)
        await dispatch(updateUsersAvatarThunk(avatarUrl))
      toast.success("Success")
      closeModal(false)
    } catch (e) {
      toast.error(e)
    }
  }
  const handleFileChange = event => {
    const file = event.target.files[0]

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarUrl(file)
        setAvatar(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }
  const handleFileRemove = async () => {
    try {
      const avatarArr = userAvatar.split("avatar/")
      const avatarId = avatarArr[1].split(".")[0]
      // console.log(avatarId)
      await dispatch(deleteUsersAvatarThunk(avatarId))
      setAvatar(null)
    } catch (e) {
      toast.error(e)
    }
  }
  return (
    <div className={styles.backDrop}>
      <div className={styles.wrapperSettings}>
        <div className={styles.boxForTitle}>
          <h3 className={styles.titleProfileSettings}>Profile settings</h3>
        </div>
        <span className={styles.userImg}>
          {avatar ? (
            <img src={avatar} alt='' className={styles.userAvatar} />
          ) : (
            <UserBaseImg className={styles.svgBaseImg} />
          )}
        </span>
        <ul className={styles.listButtonUR}>
          <li>
            <button
              className={styles.buttonUpload}
              onClick={() => document.getElementById("getFile").click()}
            >
              Upload new photo
            </button>
            <input
              type='file'
              id='getFile'
              className={styles.displayNone}
              onChange={handleFileChange}
            />
          </li>
          <li>
            <button className={styles.buttonRemove} onClick={handleFileRemove}>
              Remove
            </button>
          </li>
        </ul>
        <ul className={styles.listWithSelect}>
          <li>
            <CustomSelect
              currency={currency}
              setCurrency={setCurrency}
              className={styles.selectStyle}
            />
          </li>
          <li>
            <input
              className={styles.nameUser}
              defaultValue={userName}
              onChange={e => setName(e.target.value)}
            />
          </li>
        </ul>
        <button className={styles.buttonSave} onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  )
}
