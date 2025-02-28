import React from "react"
import Chat from "./components/Chat"
import Detail from "./components/Detail"
import List from "./components/list/List"
import {Routes, Route} from 'react-router-dom'
import Home from "./components/Home"
import SignIn from "./components/SignIn"
import AuthProvider from "./components/AuthProvider"
import SignUp from "./components/SignUp"

const App = () => {
  return (
    <main>
      <AuthProvider>
        <Routes>
          <Route path='sign-in' element={<SignIn />} />
          <Route path='sign-up' element={<SignUp />} />
          <Route path='/' element={<Home />}>
            <Route path=':id' element={<Chat />}/>
          </Route>
        </Routes>
      </AuthProvider>
    </main>
  )
}

export default App