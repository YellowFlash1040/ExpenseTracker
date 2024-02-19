import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"

import { AuthForm, BgImageWrapper } from "../../components/index"

import styles from "./LoginPage.module.css"
import { loginThunk } from "@/redux/auth/operations"
import { selectError } from "@/redux/auth/slice"
import { useEffect } from "react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

import { useWindowSizeHook } from "@/hooks/WindowSizeHook"

const LoginPage = () => {
  const dispatch = useDispatch()
  const error = useSelector(selectError)

  const navigate = useNavigate()
  const { windowSize } = useWindowSizeHook()

  const formData = [
    { name: "email", type: "text", placeholder: "Email" },
    { name: "password", type: "password", placeholder: "Password" },
  ]

  const { register } = useForm({})

  const onSubmit = async data => {
    try {
      await dispatch(loginThunk(data))
    } catch (error) {
      toast.error(`Something went wrong, please try again`)
    }
  }

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  const navigation = {
    text: "Don't have an account?",
    textLink: "Sign Up",
    route: "/register",
  }

  return (
    <>
      <div className={styles.wrapperMain}>
        <div className={styles.wrapper}>
          <h1 className={styles.title}>Sign In</h1>
          <p className={styles.description}>
            Welcome back to effortless expense tracking! Your financial
            dashboard awaits.
          </p>
          <AuthForm
            formData={formData}
            buttonText='Sign In'
            onSubmit={onSubmit}
            register={register}
            navigation={navigation}
          />
        </div>
      </div>
      {windowSize.innerWidth >= 1440 && <BgImageWrapper />}
    </>
  )
}

export default LoginPage
