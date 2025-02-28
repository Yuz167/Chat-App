import React from 'react'
import { Link } from 'react-router-dom'
import { IChat } from '../lib/interfaces'
import { useAuthStore } from '../store/useAuthStore'
import { useChatStore } from '../store/useChatStore'

const ChatBar = ({chat}:{chat:IChat}) => {
  const {setSelectedChat} = useChatStore()
  const {authUser} = useAuthStore()
  const handleClick = () => {
    setSelectedChat({chatId:chat._id.toString(), userId:(authUser?._id === chat.participant1)? chat.participant2: chat.participant1})
  }
  return (
    <Link className='' to={chat._id.toString()} onClick={handleClick}>
        <div className='flex pl-4 gap-4'>
            <img src='./avatar.png' className='h-[50px] w-[50px] rounded-full'/>
            <div className=''>
                <span>{authUser?._id === chat.participant1? chat.participant2.toString() : chat.participant1.toString()}</span>
                <p className='text-[14px] font-medium'>{chat.lastMessage}</p>
            </div>
        </div>
        <hr className='opacity-25 mt-4'></hr>
    </Link>
  )
}

export default ChatBar