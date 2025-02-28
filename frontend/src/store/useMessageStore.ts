import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../queryKeys";
import { useAuthStore } from "./useAuthStore";
import { useChatStore } from "./useChatStore";
import { IChat, IMessage } from "../lib/interfaces";
import mongoose from "mongoose";

export const useMessageStore = create((set, get:()=>any) => ({
    authUser: null,
    socket: null,
    selectedImages:[],

    getMessages : async(data:{chatId:string}) => {
        try {
            const response = await axiosInstance.get(`/message/${data.chatId}`)
            return response.data.messages
        } catch (error:any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch messages')
        }
    },

    useGetMessages : (chatId:string) => {
        return useQuery({
            queryKey:[QUERY_KEYS.GET_MESSAGES, chatId],
            queryFn:() => get().getMessages({chatId})
        })
    },

    sendMessage : async (data:{sender:mongoose.Types.ObjectId, reciever:mongoose.Types.ObjectId, chatId:string, content:string, imageUrl:string[]}) => {
        if (!data.sender || !data.reciever || !data.chatId || !data.content) throw new Error('Missing some informations');
        try {
            const response = await axiosInstance.post('/message/sendMessage', data)
            return { newMessage: response.data.newMessage, chatId:data.chatId}
        } catch (error:any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch messages')
        }
    },

    useSendMessage: () => {
        const queryClient =  useQueryClient()
        return useMutation({
            mutationFn: (data:{sender:mongoose.Types.ObjectId, reciever:mongoose.Types.ObjectId, chatId:string, content:string, imageUrl:string[]}) => get().sendMessage(data),
            onSuccess: (data:any) => {
                queryClient.setQueryData([QUERY_KEYS.GET_MESSAGES, data.chatId],(oldMessages:IMessage[]) => {
                    return [...oldMessages, data.newMessage]
                }),
                queryClient.setQueryData([QUERY_KEYS.GET_CHATS, useAuthStore.getState().authUser?._id],(oldChats:IChat[]) => {
                    if(!oldChats) return oldChats
                    return oldChats.map((chat:IChat)=>(
                        chat._id.toString() === useChatStore.getState().selectedChat.selectedChatId ? 
                        {...chat, lastMessage:data.newMessage.content}
                        :
                        chat
                    ))
                })
            }
        })
    },

    subscribeToMessage : (queryClient: QueryClient) => {
        const socket = useAuthStore.getState().socket
        const selectedChat = useChatStore.getState().selectedChat

        socket?.on("newMessage", (newMessage:IMessage) => {

            queryClient.setQueryData([QUERY_KEYS.GET_CHATS, useAuthStore.getState().authUser?._id],(oldChats:IChat[]) => {
                if(!oldChats) return oldChats
                return oldChats.map((chat:IChat)=>(
                    chat._id.toString() === newMessage.chatId ? 
                    {...chat, lastMessage:newMessage.content ? newMessage.content : 'img'}
                    :
                    chat
                ))
            })

            if(newMessage.chatId !== selectedChat.selectedChatId) return 
      
            queryClient.setQueryData([QUERY_KEYS.GET_MESSAGES, selectedChat.selectedChatId], (oldMessages:IMessage[]) => {
                return [...oldMessages, newMessage];
            });
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket
        socket.off("newMessage")
    },

    setSelectedImages: (newImages:string[]) => set({selectedImages:[...(get().selectedImages), ...newImages]}),

    clearSelectedImages: () => set({selectedImages:[]}),

    convertFileToBase64 : (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = (error) => reject(error)
        })
    }

}))