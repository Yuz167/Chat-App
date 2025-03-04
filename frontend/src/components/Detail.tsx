import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useNavigate } from 'react-router-dom'
import { useQueries, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { IFriendRequest, IUser } from '../lib/interfaces'
import { QUERY_KEYS } from '../queryKeys'
import { FcCheckmark, FcDisapprove } from "react-icons/fc"
import { useChatStore } from '../store/useChatStore'
import mongoose from 'mongoose'

const Detail = () => {
  const [showSetings, setShowSettings] = useState<boolean>(false)
  const [showFriendRequests, setShowFriendRequests] = useState<boolean>(false)
  const [showPhotos, setShowPhotos] = useState<boolean>(false)
  const [showFiles, setShowFiles] = useState<boolean>(false)
  const {useCreateChat} = useChatStore()
  const {mutateAsync:formChat} = useCreateChat()
  const {authUser, unReadFriendRequests, useLogOut, subscribeToFriendRequest, unsubscribeFromFriendRequest, useGetFriendRequest, setUnReadFriendRequests, getIndividulUser} = useAuthStore()
  const {data:friendRequests, isFetching:isGettingRequests} = useGetFriendRequest()
  const {mutateAsync:signOut, isPending:isSigningOut} = useLogOut()
  const navigate = useNavigate()
  const queryClient =  useQueryClient()
  const userQueries = useQueries<UseQueryResult<IUser, Error>[]>({
    queries: friendRequests?.map((request: IFriendRequest) => ({
      queryKey: [QUERY_KEYS.GET_INDIVIDUAL_USER, request.sender],
      queryFn: () => getIndividulUser(request.sender) as IUser,
      enabled: !!request.sender,
    })) || [],
  })

  const show = (index:number) => {
    const arr:boolean[] = [showPhotos, showFriendRequests, showSetings, showFiles]
    const StateActionArray:React.Dispatch<React.SetStateAction<boolean>>[] = [setShowPhotos, setShowFriendRequests, setShowSettings, setShowFiles]

    for(let i = 0; i<StateActionArray.length; i++){
      if(i === index){
        StateActionArray[i](prev => !prev)
      }
      else if(arr[i]){
        StateActionArray[i](false)
      }
    }

    if(index === 1 && unReadFriendRequests) setUnReadFriendRequests()
  }

  const acceptFriendRequest = async(participant1:mongoose.Types.ObjectId|undefined, participant2:mongoose.Types.ObjectId|undefined) => {
    if(!participant1 || ! participant2) throw new Error('Missing participants')
    
    try{
      await formChat({participant1,participant2})

    }catch(error){
      console.log(error)
    }
  }

  const SignOut = async() => {
    await signOut()
    navigate('sign-in') 
  }

  useEffect(()=>{
    subscribeToFriendRequest(queryClient)

    return () => unsubscribeFromFriendRequest()
  })

  return (
    <div className='flex-1 flex flex-col'>
      <div className='flex flex-col justify-center items-center gap-3 py-5 border-b-[1px] border-b-[#dddddd35]'>
        <img src={authUser?.imageUrl || '/avatar.png'} className='w-[70px] h-[70px] rounded-full'/>
        <h1 className='font-semibold'>{authUser?.username}</h1>
        <p className='text-xs'>Study hard, Play hard</p>
      </div>
      <ul className='flex w-full flex-col p-4 gap-5'>
        <li className='flex items-center'>
          <p className='text-xs'>Chat Settings</p>
          <img src={showSetings ? '/arrowDown.png':'/arrowUp.png'} onClick={()=>show(2)} className='cursor-pointer ml-auto h-[25px] w-[25px] p-[8px] rounded-full bg-[rgba(17,25,40,0.3)]'/>
        </li>

        <li className='flex items-center'>
          <p className='text-xs'>Shared photos</p>
          <img src={showPhotos ? '/arrowDown.png':'/arrowUp.png'} onClick={() => show(0)} className='ml-auto h-[25px] w-[25px] p-[8px] rounded-full bg-[rgba(17,25,40,0.3)]'/>
        </li>

        {showPhotos && 
          <li className='flex flex-col gap-3 max-h-[10rem] overflow-scroll'>
            <div className='flex items-center'>
              <div className='flex gap-3 items-center'>
                <img src='/favicon.png' className='h-[40px] w-[40px]'/>
                <p className='text-[0.70rem] font-light'>Photo_2024_2.png</p>
              </div>
              <img src='/download.png' className='ml-auto h-[28px] w-[28px] p-[8px] rounded-full bg-[rgba(17,25,40,0.3)]'/>
            </div>

            <div className='flex items-center'>
              <div className='flex gap-3 items-center'>
                <img src='/favicon.png' className='h-[40px] w-[40px]'/>
                <p className='text-[0.70rem] font-light'>Photo_2024_2.png</p>
              </div>
              <img src='/download.png' className='ml-auto h-[28px] w-[28px] p-[8px] rounded-full bg-[rgba(17,25,40,0.3)]'/>
            </div>

            <div className='flex items-center'>
              <div className='flex gap-3 items-center'>
                <img src='/favicon.png' className='h-[40px] w-[40px]'/>
                <p className='text-[0.70rem] font-light'>Photo_2024_2.png</p>
              </div>
              <img src='/download.png' className='ml-auto h-[28px] w-[28px] p-[8px] rounded-full bg-[rgba(17,25,40,0.3)]'/>
            </div>

            <div className='flex items-center'>
              <div className='flex gap-3 items-center'>
                <img src='/favicon.png' className='h-[40px] w-[40px]'/>
                <p className='text-[0.70rem] font-light'>Photo_2024_2.png</p>
              </div>
              <img src='/download.png' className='ml-auto h-[28px] w-[28px] p-[8px] rounded-full bg-[rgba(17,25,40,0.3)]'/>
            </div>
          </li>
        }

        <li className='flex items-center'>
          <p className='text-xs'>Shared Files</p>
          <img src={showFiles ? '/arrowDown.png':'/arrowUp.png'} onClick={()=>show(3)} className='ml-auto h-[25px] w-[25px] p-[8px] rounded-full bg-[rgba(17,25,40,0.3)]'/>
        </li>

        <li className='flex items-center relative'>
          {unReadFriendRequests && <span className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>}
          <p className='text-xs'>New Friend Requests</p>
          <img src={showFriendRequests ? '/arrowDown.png':'/arrowUp.png'} onClick={()=>show(1)} className='ml-auto h-[25px] w-[25px] p-[8px] rounded-full bg-[rgba(17,25,40,0.3)]'/>
        </li>

        {!isGettingRequests && showFriendRequests &&
          <ul className='flex flex-col gap-3 max-h-[10rem] overflow-scroll'>
            {friendRequests?.map((request:IFriendRequest, index:number) => {
              const {data, isFetching} = userQueries[index] as UseQueryResult<IUser, Error>

              if(isFetching) return

              return(
                <div className='flex items-center pr-5'>
                  <div className='flex gap-3 items-center'>
                    <img src={data?.imageUrl || '/avatar.png'} className='h-[40px] w-[40px]'/>
                    <p className='text-[0.70rem] font-light'>{data?.username}</p>
                  </div>
                  <div className='ml-auto flex gap-6'>
                    <div onClick={() => acceptFriendRequest(authUser._id, data?._id)} className='cursor-pointer'>
                      <FcCheckmark />
                    </div>
                    <div className='cursor-pointer'>
                      <FcDisapprove />
                    </div>
                  </div> 
                </div>)
            })}
          </ul>
        }

      </ul>

      <div className='mt-auto px-4 mb-8'>
        <button onClick = {SignOut} className='bg-red-900 opacity-80 w-full rounded-md text-sm py-2'>{isSigningOut? 'Signing Out' : 'Sign Out'}</button>
      </div>

    </div>
  )
}

export default Detail