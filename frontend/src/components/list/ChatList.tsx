import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ChatBar from '../ChatBar'
import { useChatStore } from '../../store/useChatStore'
import { IChat, IUser } from '../../lib/interfaces'
import { useAuthStore } from '../../store/useAuthStore'
import UserBar from '../UserBar'
import {useInView} from 'react-intersection-observer'
import Loader from '../Loader'
import { useQueryClient } from '@tanstack/react-query'


const ChatList = () => {
  const [addMode, setAddMode] = useState<boolean>(false)
  const {useGetChats, subscribeToNewChat, unsubscribeFromNewChat} = useChatStore()
  const {data:chats, isFetching:isLoadingChats} = useGetChats()
  const {useGetUsers} = useAuthStore()
  const {data:addFriendList, fetchNextPage, hasNextPage} = useGetUsers()
  const {ref, inView} = useInView()
  const queryClient = useQueryClient()

  useEffect(()=>{
    if(inView) fetchNextPage()
  },[inView])

  useEffect(()=>{
    subscribeToNewChat(queryClient)

    return () => unsubscribeFromNewChat()
  })


  if(isLoadingChats) return 

  return (
    <div className='flex-1 flex flex-col overflow-scroll gap-5'>
        <div className='flex gap-4 px-3 relative'>
            {addMode && 
                <div className='absolute bg-[rgba(76,107,160,0.5)] backdrop-blur-md py-2 left-3 right-3 top-full flex flex-col overflow-scroll max-h-64'>
                    <ul className='flex flex-col gap-2'>
                        {addFriendList?.pages?.map((page:any) => (
                            page.users?.map((user:IUser)=>(
                                <li>
                                    <UserBar user={user}/>
                                </li>
                            ))
                        ))}
                    </ul>
                    {hasNextPage && 
                        <div ref={ref}>
                            <Loader />
                        </div>
                    }
                </div>
            }
            <div className='pl-2 flex-1 flex items-center bg-[rgba(17,25,40,0.5)] rounded-md gap-3'>
                <img src='/search.png' className='h-[20px] w-[20px]' />
                <input type='text' placeholder='Search' className='w-full bg-transparent focus:border-none focus:outline-none placeholder:text-xs'></input>
            </div>
            <img 
                src={addMode? '/minus.png' : '/plus.png'} 
                className='bg-[rgba(17,25,40,0.5)] h-[36px] w-[36px] p-[10px] rounded-md cursor-pointer'
                onClick={()=>setAddMode(prev => !prev)}
            />
        </div>
        <div className='flex flex-col'>
            {/* <ChatBar  chatId={chats[0]._id}/> */}
            {chats?.map((chat:IChat)=>(
                <ChatBar  chat={chat} />
            ))}
        </div>
    </div>
  )
}

export default ChatList