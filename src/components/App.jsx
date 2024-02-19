import { Navigate, Route, Routes } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { lazy, useEffect } from "react"

import { ROUTES } from "../constants"
import { selectIsLoggedIn, selectRefreshToken } from "@/redux/auth/slice"
import { refreshThunk } from "@/redux/auth/operations"
import { PrivateRoute } from "@/routes/PrivateRoute"
import { PublicRoute } from "@/routes/PublicRoute"
import { Layout } from "../components"

const Home = lazy(() => import("@/pages/Home/Home"))
const LoginPage = lazy(() => import("@/pages/LoginPage/LoginPage"))
const RegisterPage = lazy(() => import("@/pages/RegisterPage/RegisterPage"))
const WelcomePage = lazy(() => import("@/pages/WelcomePage/WelcomePage"))
const TarnsactionsHistoryPage = lazy(() =>
  import("@/pages/TarnsactionsHistoryPage/TarnsactionsHistoryPage"),
)

const { HOME, SIGN_IN, SIGN_UP, TRANSACTION, HISTORY } = ROUTES
function App() {
  const dispatch = useDispatch()
  const refreshToken = useSelector(selectRefreshToken)
  const isLoggedIn = useSelector(selectIsLoggedIn)

  useEffect(() => {
    if (refreshToken && !isLoggedIn) dispatch(refreshThunk())
  }, [dispatch, isLoggedIn, refreshToken])

  return (
    <Routes>
      <Route path={HOME} element={<Layout />}>
        <Route
          index
          element={
            isLoggedIn ? (
              <Navigate to='/transactions/expenses' />
            ) : (
              <WelcomePage />
            )
          }
        />
        <Route
          path={`${TRANSACTION}/:transactionsType`}
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path={SIGN_IN}
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path={SIGN_UP}
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path={`${TRANSACTION}/${HISTORY}/:transactionsType`}
          element={
            <PrivateRoute>
              <TarnsactionsHistoryPage />
            </PrivateRoute>
          }
        />
      </Route>

      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  )
}

export default App
