import React from "react"
import ReactDOM from "react-dom/client"
import { PersistGate } from "redux-persist/integration/react"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import { ToastContainer } from "react-toastify"

import App from "./components/App.jsx"

import { persistor, store } from "./redux"
import "modern-normalize/modern-normalize.css"
import "react-toastify/dist/ReactToastify.min.css"
import "overlayscrollbars/overlayscrollbars.css"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
        <ToastContainer />
      </PersistGate>
    </Provider>
  </BrowserRouter>,
)
