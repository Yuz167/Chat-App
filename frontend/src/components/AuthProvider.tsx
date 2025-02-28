import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'
import { useAuthStore } from '../store/useAuthStore'
import { useNavigate } from 'react-router-dom'


const AuthProvider = ({children}:{children:ReactNode}) => {
  const navigate = useNavigate()
  const {checkAuth} = useAuthStore()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(()=>{
    const AuthenciateUser = async () => {
      try{
        await checkAuth()
      }catch(error){
        navigate('sign-in')
        console.log(error)
      }finally{
        setLoading(false)
      }
    }
    AuthenciateUser()
  },[])


  return (
    loading? <p>Loading ....</p> : <main>{children}</main>
  )
}

export default AuthProvider