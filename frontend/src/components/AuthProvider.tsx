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
    loading? <p>Loading ....</p> : 
    
    <div className='text-white w-screen h-screen relative flex justify-center items-center'>
      <img 
        src={'/bg.jpg'}
        className='object-cover h-full w-full absolute -z-10'
      />
      <main className='flex bg-[rgba(17,25,40,0.75)] h-[90vh] w-[90vw] rounded-md backdrop-blur-md backdrop-saturate-150 border-[1px] border-solid border-[rgba(255, 255, 255, 0.125)]'>
        {children}
      </main>
    </div>
  )
}

export default AuthProvider