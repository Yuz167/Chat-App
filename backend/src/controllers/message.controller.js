import { getReciverSocketId, io } from "../lib/socket.js"
import Message from "../models/message.model.js"
import Chat from "../models/chat.model.js"
import cloudinary from "../lib/cloudinary.js"
import mongoose from "mongoose"

export const sendMessage = async(req, res) => {
    const {sender, reciever, content, chatId, imageUrl} = req.body
    if(!sender || !reciever || !chatId || !content){
        return res.status(400).json({error:true, message:'please enter a valid input'})
    }
    try {
        let imageUrls
        if(imageUrl) {
            const uploadPromises = imageUrl.map((image) =>
                cloudinary.uploader.upload(image)
            )
            const uploadResponses = await Promise.all(uploadPromises)
            imageUrls = uploadResponses.map((response)=>(response.secure_url))
        }
        const newMessage = await Message.create({
            ...req.body,
            imageUrl:imageUrls
        })
        if(!newMessage){
            return res.status(400).json({error:true, message:'Failed to create message'})
        }

        const updatedChat = await Chat.findByIdAndUpdate(
            new mongoose.Types.ObjectId(chatId),
            { lastMessage: content || 'img'},
            { new: true } //ensures updatedChat is immediately updated, not really useful here
        )
        if(!updatedChat){
            return res.status(400).json({error:true, message:'Failed to update last message'})
        }
          
        const receiverSocketId = getReciverSocketId(reciever)
        if(receiverSocketId){ io.to(receiverSocketId).emit("newMessage", newMessage) }

        return res.json({
            newMessage,
            error:false,
            message:'Success'
        })
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        return res.status(500).json({error:true, message:"Internal Server Error"})
    }
}

export const getMessage = async(req, res) => {
    const {chatId} = req.params
    if(!chatId) return res.status(400).json({error:true, message:"Missing chat id"})
    
    try{
        const messages = await Message.find({ chatId }).sort({ createdAt: 1 });


        if(!messages) return res.status(400).json({error:true, message:"Missing messages"})
        
        return res.json({
            error:false,
            message:"Success",
            messages
        })

    } catch (error) {
        return res.status(500).json({error:true, message:"Internal Server Error"})
    }
}