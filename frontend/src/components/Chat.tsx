import React, { useEffect, useRef, useState } from 'react'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useMessageStore } from '../store/useMessageStore'
import { useChatStore } from '../store/useChatStore'
import { useQueryClient } from '@tanstack/react-query'
import { IMessage } from '../lib/interfaces'
import { useAuthStore } from '../store/useAuthStore'
import ImageComponent from './ImageComponent'
import { computeTime } from '../lib/computeTime'

const Chat = () => {
  const {id} = useParams()
  const queryClient =  useQueryClient()
  const {selectedChat, setSelectedChat} = useChatStore()
  const {authUser} = useAuthStore()
  const {subscribeToMessage, unsubscribeFromMessages, selectedImages, setSelectedImages, useSendMessage, useGetMessages, clearSelectedImages, convertFileToBase64, useGetIndividulUser} = useMessageStore()
  const {data:messages, isFetching:isLoadingMessages} = useGetMessages(id)
  const {mutateAsync:sendMessage} = useSendMessage()
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false)
  const [text, setText] = useState<string>('')
  const messageEndRef = useRef<HTMLDivElement | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()



  function handleEmojiClick(emoji: EmojiClickData, event: MouseEvent): void {
    setText(prev => prev + emoji.emoji)
  }

  const selectImages = async(event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files && files.length > 0) {
      try{
        const imagesArray = await Promise.all(files.map((file) =>
          convertFileToBase64(file)
        ))
        setSelectedImages(imagesArray)
      }catch(error){
        console.error("Error converting file:", error)
      }
    }
  }

  useEffect(()=>{
    subscribeToMessage(queryClient)


    return () => unsubscribeFromMessages()
  },[selectedChat, subscribeToMessage, unsubscribeFromMessages])

  useEffect(()=>{
    if(messageEndRef.current){
      messageEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
    
  },[messages])

  const deliverMessage = async() => {
    const messageDetail = {
      sender: authUser?._id,
      reciever: selectedChat.selectedUserId,
      content: text,
      chatId: id,
      ...(selectedImages.length > 0 && {imageUrl: selectedImages})
    }
    await sendMessage(messageDetail)
    setText('')
    clearSelectedImages()

  }

  return (

    // Top Bar 
    <div className='flex-2 border-x-[1px] border-x-[#dddddd35] flex flex-col'>
      <div className='flex justify-between items-center p-4 border-b-[#dddddd35] border-b-[1px]'>
        <div className='flex gap-4 items-center'>
          <img src={searchParams.get('chatUserAvatar') || '/avatar.png'} className='rounded-full object-cover h-[60px] w-[60px]'/>
          <div>
            <p className='text-[18px] font-semibold'>{searchParams?.get('chatUser')}</p>
            <p className='text-[12px] font-light text-[#a5a5a5]'>Study hard, Play hard</p>
          </div>
        </div>
        <div className='flex gap-5'>
          <img className='w-[20px] h-[20px] cursor-pointer' src='/phone.png' />
          <img className='w-[20px] h-[20px] cursor-pointer' src='/video.png' />
          <img className='w-[20px] h-[20px] cursor-pointer' src='/info.png' />
        </div>
      </div>

      {/* Content */}
      <div className='py-4 px-4 flex flex-col gap-4 overflow-scroll'>
        {messages?.map((message:IMessage) => (
          message.sender === authUser?._id ?
          <div ref={messageEndRef} className='flex gap-1 flex-col self-end max-w-[26rem]'>
            {message.imageUrl?.map((imageUrl:string)=>(
              <img src={imageUrl} className='w-full max-h-[300px] rounded-lg object-contain'/>
            ))}
            {message.content && <div className='bg-[rgb(81,131,254)] p-4 rounded-lg w-fit self-end'>
              <p className='text-sm'>{message.content}</p>
            </div>}
            <p className='text-xs'>{computeTime(message.createdAt)}</p>
          </div>
          :
          <div ref={messageEndRef} className='flex gap-4'>
            <img src={searchParams.get('chatUserAvatar') || '/avatar.png'} className='h-[30px] w-[30px] rounded-full'/>
            <div className='space-y-1 max-w-[26rem]'>
              {message.imageUrl?.map((imageUrl:string)=>(
                <img src={imageUrl} className='w-full max-h-[300px] rounded-lg object-contain'/>
              ))}
              {message.content && 
                <div className='bg-[rgba(17,25,40,0.3)] p-4 rounded-lg w-fit'>
                  <p className='text-sm'>{message.content}</p>
                </div>
              }
              <p className='text-xs'>{computeTime(message.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className='mt-auto flex items-center gap-4 px-4 border-t-[1px] border-t-[#dddddd35] py-5'>
        <div className='flex gap-4'>
          <div>
            <input id="file-input" type="file" accept="image/*" multiple className='hidden' onChange={selectImages}/>
            <label htmlFor="file-input"> {/* Associate the label with the input */}
              <img
                src="/img.png"
                className="w-[20px] h-[20px] cursor-pointer"
                alt="Upload Image"
              />
            </label>
          </div>
          <img src='/camera.png' className='w-[20px] h-[20px] cursor-pointer'/>
          <img src='/mic.png' className='w-[20px] h-[20px] cursor-pointer'/>
        </div>
        <div className={`flex-1 p-[16px] bg-[rgba(44,45,49,0.5)] ${selectedImages.length > 0 ? 'rounded-b-xl':'rounded-xl'}  relative`}>
          {selectedImages.length > 0 &&
            <div className='translate-y-[0px] grid gap-2 grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 bottom-full left-0 absolute w-full p-[16px] bg-[rgba(44,45,49,0.5)] rounded-t-xl'>
              {selectedImages.map((image:string, index:number)=>(
                <ImageComponent src={image} index={index}/>
              ))}
            </div>
          }
          <input 
            onChange={(e)=>setText(e.target.value)} 
            value={text} 
            onKeyDown={(e) => {
              if(e.key === 'Enter'){
                deliverMessage()
              }
            }} 
            placeholder='Type a message...' 
            className='w-full text-[16px] bg-transparent focus:border-none focus:outline-none'>
          </input>

        </div>
        <div className='flex items-center gap-4 relative'>
          <img src='/emoji.png' className='w-[20px] h-[20px] cursor-pointer' onClick={() => setShowEmojiPicker(prev => !prev)}/>
          {showEmojiPicker && 
            <div className='absolute z-10 -top-[29rem] left-4'>
              <EmojiPicker onEmojiClick={handleEmojiClick}/>
            </div>
          }
          <button onClick = {deliverMessage} className='bg-[#5183fe] text-white py-[5px] px-[16px] border-none rounded-md'>Send</button>
        </div>
      </div>

    </div>
  )
}

export default Chat