import React from 'react'
import SignIn from './SignIn'
import SignUp from './SignUp'

const Registration = () => {
  return (
    <div className='flex w-full h-full py-16'>
        <SignIn />
        <SignUp />
    </div>
  )
}

export default Registration