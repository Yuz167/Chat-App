import React from "react"
import Chat from "./components/Chat"
import {Routes, Route} from 'react-router-dom'
import Home from "./components/Home"
import AuthProvider from "./components/AuthProvider"
import Registration from "./components/Registration"

const App = () => {
  return (
    <main>
      <AuthProvider>
        <Routes>
          <Route path='sign-in' element={<Registration />} />
          <Route path='/' element={<Home />}>
            <Route path=':id' element={<Chat />}/>
          </Route>
        </Routes>
      </AuthProvider>
    </main>
  )
}

export default App