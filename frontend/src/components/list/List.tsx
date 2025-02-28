import React from 'react'
import Userinfo from './Userinfo'
import ChatList from './ChatList'

const List = () => {
  return (
    <div className='flex-1 flex flex-col gap-3'>
      <Userinfo />
      <ChatList />
    </div>
  )
}

export default List