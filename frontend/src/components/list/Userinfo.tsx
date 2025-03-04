import React from 'react'
import { useAuthStore } from '../../store/useAuthStore'

const Userinfo = () => {
  const {authUser} = useAuthStore()
  return (
    <div className='mb-4 w-full justify-between flex items-center p-4'>
      <div className='flex gap-3 items-center'>
        <img src={authUser?.imageUrl || '/avatar.png'} className='h-[50px] w-[50px] rounded-full'/>
        <p className='font-semibold text-md'>{authUser?.username}</p>
      </div>
      <div className='flex gap-3'>
        <img className='h-[20px] w-[20px] cursor-pointer' src='/more.png' />
        <img className='h-[20px] w-[20px] cursor-pointer' src='/video.png' />
        <img className='h-[20px] w-[20px] cursor-pointer' src='/edit.png' />
      </div>
    </div>
  )
}

export default Userinfo