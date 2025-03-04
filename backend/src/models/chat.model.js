import mongoose from "mongoose"

const Schema = mongoose.Schema

const chatSchema = new Schema({
    participant1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    participant2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    lastMessage: { type: String, default:""},
});

const Chat = mongoose.model("Chat", chatSchema)
export default Chat