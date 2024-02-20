import { createPortal } from "react-dom"
import styles from "./Modal.module.css"
import { useCallback, useEffect } from "react"
import CloseSure from "@/assets/icons/CloseSure.svg?react"

export const Modal = ({ children, isOpened, onClose, zIndex = 0 }) => {
  const handleKeyPress = useCallback(
    event => {
      if (
        event.key === "Escape" ||
        event.key === "Esc" ||
        event.keyCode === 27
      ) {
        const modalWindows = document.querySelectorAll(
          "div[data-modalwindowid]",
        )

        let idList = []
        modalWindows.forEach(modalWindow => {
          idList.push(modalWindow.dataset.modalwindowid)
        })

        idList = idList.sort((a, b) => b - a)

        // console.log("Here is your list: ", idList, "\n zIndex: ", zIndex);

        if (zIndex === +idList[0]) {
          onClose()
        }
      } /*else if (event.keyCode === 9) {
      }*/
    },
    [onClose, zIndex],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)

    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [handleKeyPress])

  useEffect(() => {
    if (isOpened) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth

      document.body.style.paddingRight = `${scrollbarWidth}px`
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.paddingRight = 0
      document.body.style.overflow = "auto"
    }
  }, [isOpened])

  if (!isOpened) return null

  return createPortal(
    <>
      <div
        className={styles.modalWindow}
        onClick={() => onClose()}
        style={{ zIndex: 1000 + zIndex }}
      />
      <div
        className={styles.modalWindowContent}
        style={{ zIndex: 1000 + zIndex }}
        data-modalwindowid={zIndex}
      >
        <button
          className={styles.closeModalButton}
          style={{ zIndex: 1000 + zIndex }}
          onClick={() => onClose()}
        >
          <CloseSure style={{ width: 20, height: 20 }} />
        </button>
        {children}
      </div>
    </>,
    document.getElementById(`modal-window`),
  )
}
