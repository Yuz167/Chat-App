import {create} from "zustand"
import { axiosInstance } from "../lib/axios";
import { QueryClient, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { QUERY_KEYS } from "../queryKeys";
import mongoose from "mongoose";
import { IFriendRequest, IUser } from "../lib/interfaces";
import { AxiosResponse } from "axios";

const BASE_URL = "http://localhost:5001"

export const useAuthStore = create((set, get:()=>any) => ({
    authUser: null,
    socket: null,
    unReadFriendRequests:false,

    checkAuth: async() => {
        try {
            const response = await axiosInstance.get('/auth/check')
            set({authUser:response.data})
            get().connectSocket()
        } catch (error:any) {
            console.log(error.response?.data?.message)
            throw new Error(error.response?.data?.message || 'Failed to fetch data')
        }
    },

    useCheckAuth: () => {
        return useMutation({
            mutationFn: () => get().checkAuth()
        })
    },

    signUp : async (data:{username:string, email:string, imageId?:string, imageUrl?:string, password:string}) => {
        if (!data.username || !data.email || !data.password) throw new Error('Missing some informations');
        try {
            const response = await axiosInstance.post('/auth/signup', data)
            set({authUser:response.data.newUser})
            get().connectSocket()
        } catch (error:any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch data')
        }
    },

    useSignUp : () => {
        return useMutation({
            mutationFn:(data:{username:string, email:string, imageId?:string, imageUrl?:string, password:string}) => get().signUp(data),
        })
    },

    logIn: async (data:{email:string, password:string}) => {
        if (!data.email || !data.password) throw new Error('Missing some informations')
        
        try {
            const response = await axiosInstance.post('/auth/login', data)
            set({authUser:response.data.user})
            get().connectSocket()
        } catch (error:any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch data')
        }
    },

    useLogIn: () => {
        return useMutation({
            mutationFn:(data:{email:string, password:string}) => get().logIn(data)
        })
    },

    logOut: async() => {
        try {
            await axiosInstance.post('/auth/logout')
            set({authUser:null})
            get().disconnectSocket()
        } catch (error:any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch data')
        }
    },

    useLogOut: () => {
        return useMutation({
            mutationFn: () => get().logOut()
        })
    },

    connectSocket: () => {
        const { authUser } = get()
        if (!authUser || get().socket?.connected) return
    
        const socket = io(BASE_URL, {
          query: {
            userId: authUser._id,
          },
        })

        socket.connect()
    
        set({ socket: socket })
    
        // socket.on("getOnlineUsers", (userIds) => {
        //   set({ onlineUsers: userIds });
        // });
    },

    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect()
    },

    getUsers: async(page:number) => {
        try{
            const response = await axiosInstance.get(`/auth/getUsers?page=${page}`)
            return {users:response.data.users, page:response.data.page}
        } catch (error:any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch data')
        }
    },

    useGetUsers: () => {
        return useInfiniteQuery({
            queryKey:[QUERY_KEYS.GET_USERS, get().authUser?._id],
            queryFn: ({pageParam}) => get().getUsers(pageParam),
            initialPageParam: 1,
            getNextPageParam: (lastPage) => {
                if(!lastPage || lastPage.users?.length < 2){
                    return null
                }
    
                return Number(lastPage.page) + 1
            }
        })
    },

    sendFriendRequest: async({sender, reciever}:{sender:mongoose.Types.ObjectId, reciever:mongoose.Types.ObjectId}) => {
        if(!sender || !reciever) throw new Error('Missing sender or reciever')
        
        try {
            const response = await axiosInstance.post('/auth/sendFriendRequest', {sender, reciever})
            return response.data
        } catch (error:any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch data')
        }
    },

    useSendFriendRequest: () => {
        return useMutation({
            mutationFn: (data:{sender:mongoose.Types.ObjectId, reciever:mongoose.Types.ObjectId}) => get().sendFriendRequest(data)
        })
    },

    getFriendRequest: async() => {
        try{
            const response = await axiosInstance.get('/auth/getFriendRequests')
            return response.data.friendRequests
        }catch(error:any){
            throw new Error(error.response?.data?.message || 'Failed to fetch data')
        }
    },

    useGetFriendRequest: () => {
        return useQuery({
            queryKey:[QUERY_KEYS.GET_FRIEND_REQUESTS],
            queryFn:() => get().getFriendRequest()
        })
    },

    subscribeToFriendRequest : (queryClient: QueryClient) => {

        get().socket?.on("newFriendRequest", (newFriendRequest:IFriendRequest) => {

            queryClient.setQueryData([QUERY_KEYS.GET_FRIEND_REQUESTS],(oldFriendRequests:IFriendRequest[]) => {
                if(!oldFriendRequests) return oldFriendRequests
                return [...oldFriendRequests, newFriendRequest]
            })

            set({unReadFriendRequests:true})
        })
    },

    unsubscribeFromFriendRequest: () => {
        get().socket.off("newFriendRequest")
    },

    setUnReadFriendRequests: () => set({unReadFriendRequests:false}),

    getIndividulUser: async(userId:mongoose.Types.ObjectId):Promise<IUser>=>{
        if(!userId) throw new Error('Missing target user Id')
        try {
            const response:AxiosResponse<IUser> = await axiosInstance.get(`/auth/getIndividulUser/${userId}`)
            return response.data
        } catch (error:any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch data')
        }
    },

    useGetIndividulUser: ({userId, options}:{userId:mongoose.Types.ObjectId, options?:{enabled:boolean}}) => {
        return useQuery({
            queryKey:[QUERY_KEYS.GET_INDIVIDUAL_USER, userId],
            queryFn:() => get().getIndividulUser(userId),
            enabled: options?.enabled,
        })
    },

    deleteFriendRequest: async(data:{participant1:mongoose.Types.ObjectId, participant2:mongoose.Types.ObjectId}) => {
        if(!data.participant1 || !data.participant2) throw new Error('Missing participants')
        try {
            const response = await axiosInstance.post('/auth/deleteFriendRequests', data)
        } catch (error:any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch data')
        }
    },

    useDeleteFriendRequest: () => {
        const queryClient =  useQueryClient()
        return useMutation({
            mutationFn:(data:{participant1:mongoose.Types.ObjectId, participant2:mongoose.Types.ObjectId}) => get().deleteFriendRequest(data),
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey:[QUERY_KEYS.GET_FRIEND_REQUESTS]
                })
            }
        })
    }

}))
