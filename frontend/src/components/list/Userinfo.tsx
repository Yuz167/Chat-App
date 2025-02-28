import React from 'react'

const Userinfo = () => {
  return (
    <div className='mb-4 w-full justify-between flex items-center p-4'>
      <div className='flex gap-3 items-center'>
        <img src='/avatar.png' className='h-[50px] w-[50px] rounded-full'/>
        <p className='font-semibold text-md'>Dylan Zhang</p>
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