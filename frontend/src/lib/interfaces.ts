import mongoose from "mongoose";


export interface IChat extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    participant1: mongoose.Types.ObjectId;
    participant2: mongoose.Types.ObjectId;
    lastMessage: string;
}

export interface IUser extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    username: string,
    email: string,
    password: string,
    imageId?: string, 
    imageUrl?: string
}

export interface IMessage extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    reciever: mongoose.Types.ObjectId;
    content: string;
    chatId: string;
    imageUrl?: string[];
    createdAt: string;   // Automatically set by Mongoose
    updatedAt: string;
}

export interface IFriendRequest extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    reciever: mongoose.Types.ObjectId;
    createdAt: string;   // Automatically set by Mongoose
    updatedAt: string;
}