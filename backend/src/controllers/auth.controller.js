import { generateToken } from "../lib/utilis.js"
import User from "../models/user.model.js"
import Chat from "../models/chat.model.js"
import FriendRequest from "../models/friendRequest.model.js"
import bcrypt from "bcryptjs"
import { getReciverSocketId, io } from "../lib/socket.js"

export const signup = async(req, res) =>{
    const{username, password, email, imageId, imageUrl} = req.body
    if(!username || !email || !password){
        return res.status(400).json({error:true, message: "Please enter a username, name, email and a password for your account"})
    }
    try {
        const user = await User.findOne({email})
        if(user) return res.status(400).json({error:true, message: "User already exits"})

        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            ...req.body,
            password:hashedPassword
        })
        if(newUser){
            generateToken(newUser._id, res)
            await newUser.save()
            return res.json({
                error:false,
                newUser
            })
        }else{
            res.status(400).json({error:true, message: "Invalid user data"})
        }
    } catch (error) {
        return res.status(500).json({error:true, message:"Internal Server Error"})
    }
}

export const login = async(req, res) =>{
    const {email, password} = req.body
    if(!email || !password) return res.status(400).json({error:true, message: "Please enter an email and password to log in"})
    try {
        const user = await User.findOne({email})
        if(user){
            const isPasswordCorrect = await bcrypt.compare(password, user.password)
            if(isPasswordCorrect){
                generateToken(user._id,res)

                return res.json({
                    error:false,
                    user
                })
            }else{
                return res.status(400).json({
                    error:true,
                    message:"Invalid credentials"
                })
            }
        }else{
            return res.status(400).json({error:true, message: "Invalid credentials"})
        }
    } catch (error) {
        return res.status(500).json({error:true, message: "Internal Server Error"})
    }
}

export const logout = (req, res) =>{
    try {
        res.cookie("jwt", "", {maxAge:0})
        return res.status(200).json({
            error:false,
            message: "Logged out successfully"
        })
    } catch (error) {
        return res.status(500).json({error:true, message: "Internal Server Error"})
    }
}

export const getUsers = async(req, res) => {
    const { page = 1, limit = 2 } = req.query
    const currentUser = req.user._id
    if(!currentUser) return res.status(400).json({error:true, message:"Missing current user"})

    try{
        const existingChats = await Chat.find({
            $or: [{ participant1: currentUser }, { participant2: currentUser }]
        })

        const existingIDs = existingChats.map((chat)=>(
            chat.participant1.equals(currentUser) ? chat.participant2 : chat.participant1
        ))

        const users = await User.find({ _id: { $ne: currentUser, $nin: existingIDs } })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({username:1})

        if(!users) return res.status(400).json({error:true, message:"Something went wrong when retriving users"})

        return res.json({
            error:false,
            message:"Success",
            users,
            page
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({error:true, message:"Internal Server Error"})
    }
}

export const getIndividulUser = async(req, res) => {
    const {userId} = req.params
    if(!userId) return res.status(400).json({error:true, message:"Missing target user id"}) 
    
    try {
        const targetUser = await User.findOne({_id:userId})
        if(!targetUser) return res.status(400).json({error:true, message:"Something went wrong when retriving target user"})
        
        return res.json(targetUser)
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:true, message:"Internal Server Error"})
    }

}

export const checkAuth = (req, res) => {
    try {
      return res.status(200).json(req.user);
    } catch (error) {
      console.log("Error in checkAuth controller", error.message);
      return res.status(500).json({ message: error.message });
    }
}

export const sendFriendRequest = async(req, res) => {
    const {sender, reciever} = req.body
    if(!sender || !reciever) return res.status(400).json({error:true, message:"Missing sender or reciever"})
    
    try {
        const newRequest = await FriendRequest.create({
            sender,
            reciever
        })
        if(!newRequest) return res.status(400).json({error:true, message:"Something went wrong when creating new friend request"})
        
        const receiverSocketId = getReciverSocketId(reciever)
        if(receiverSocketId){ io.to(receiverSocketId).emit("newFriendRequest", newRequest) }
        
        return res.json({
            error:false,
            message:"success",
            newRequest
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:true, message:"Internal Server Error"})
    }
}

export const getFriendRequests = async(req, res) => {
    const currentUser = req.user._id
    if(!currentUser) return res.status(400).json({error:true, message:"Missing current user"})

    try {
        const friendRequests = await FriendRequest.find({reciever:currentUser})
        if(!friendRequests) return res.status(400).json({error:true, message:"Something went wrong when getting friend requests"})
        
        return res.json({
            error:false,
            message:"success",
            friendRequests
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:true, message:"Internal Server Error"})
    }
}