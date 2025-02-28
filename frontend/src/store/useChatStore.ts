import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../queryKeys";
import { useAuthStore } from "./useAuthStore";
import mongoose from "mongoose";

export const useChatStore = create((set, get:()=>any) => ({
    selectedChat:{
        selectedChatId:null,
        selectedUserId:null
    },

    getChats: async() => {
        try {
            const response = await axiosInstance.get('/chat/getChat')
            return response.data.chats
        } catch (error:any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch messages')
        }
    },

    useGetChats : () => {
        return useQuery({
            queryKey:[QUERY_KEYS.GET_CHATS, useAuthStore.getState().authUser?._id],
            queryFn: () => get().getChats()
        })
    },

    createChat: async(data:{participant1:mongoose.Types.ObjectId, participant2:mongoose.Types.ObjectId}) => {
        try {
            const response = await axiosInstance.post('/chat/createChat', data)

        } catch (error:any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch messages')
        }
    },

    useCreateChat: () => {
        return useMutation({
            mutationFn: (data:{participant1:mongoose.Types.ObjectId, participant2:mongoose.Types.ObjectId}) => get().createChat(data)
        })
    },

    setSelectedChat: ({chatId,userId}:{chatId:string,userId:mongoose.Types.ObjectId}) => set({selectedChat:{selectedChatId:chatId, selectedUserId:userId}})
    
}))