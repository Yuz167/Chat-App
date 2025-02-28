import React from 'react'
import { Link } from 'react-router-dom'
import { IUser } from '../lib/interfaces'
import { useAuthStore } from '../store/useAuthStore'
import { useChatStore } from '../store/useChatStore'

const UserBar = ({user}:{user:IUser}) => {
  const {useSendFriendRequest, authUser} = useAuthStore()
  const {mutateAsync:sendFriendRequest, isPending:isSendingRequest} = useSendFriendRequest()
  
  return (
    <div className='flex-col flex'>
        <div className='flex justify-between items-center px-2'>
            <div className='flex gap-2 items-center'>
                <img src={user?.imageUrl || './avatar.png'} className='h-[40px] w-[40px] rounded-full'/>
                <span className='text-sm'>{user?.username}</span>
            </div>
            <button onClick={async()=>await sendFriendRequest({sender:authUser._id, reciever:user._id})} className='text-xs bg-blue-500 p-1 rounded-md'>{isSendingRequest? 'Adding':'Add User'}</button>
        </div>
        <hr className='opacity-25 mt-2'></hr>
    </div>
  )
}

export default UserBar