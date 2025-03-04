import React from 'react'
import { Link, NavLink, useParams } from 'react-router-dom'
import { IChat } from '../lib/interfaces'
import { useAuthStore } from '../store/useAuthStore'
import { useChatStore } from '../store/useChatStore'

const ChatBar = ({chat}:{chat:IChat}) => {
  const {id} = useParams()
  const {setSelectedChat, selectedChat} = useChatStore()
  const {authUser, useGetIndividulUser} = useAuthStore()
  const {data:contactName, isFetching} = useGetIndividulUser({userId:(authUser?._id === chat.participant1)? chat.participant2: chat.participant1})
  const handleClick = () => {
    setSelectedChat({chatId:chat._id.toString(), userId:(authUser?._id === chat.participant1)? chat.participant2: chat.participant1})
  }

  if(isFetching) return 

  return (
    <NavLink 
      className={({isActive}) => {
        if(isActive && id === selectedChat.selectedChatId) return 'bg-slate-500 pt-4'
        else{
          return 'pt-4'
        }
      }} 
      to={`${chat._id.toString()}?chatUser=${contactName.username}${contactName.imageUrl ? `&&chatUserAvatar=${contactName.imageUrl}`:''}`} 
      onClick={handleClick}
    >
        <div className='flex pl-4 gap-4 '>
            <img src={contactName.imageUrl || '/avatar.png'} className='h-[50px] w-[50px] rounded-full'/>
            <div className=''>
                <span>{contactName.username}</span>
                <p className='text-[14px] font-medium'>{chat.lastMessage}</p>
            </div>
        </div>
        <hr className='opacity-25 mt-4'></hr>
    </NavLink>
  )
}

export default ChatBar