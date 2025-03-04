import mongoose from "mongoose"

const Schema = mongoose.Schema

const messageSchema = new Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    reciever: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: { type: String },
    chatId: { type: String, required: true},
    imageUrl: {type: [String]}
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema)
export default Message