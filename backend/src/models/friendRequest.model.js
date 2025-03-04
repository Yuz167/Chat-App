import mongoose from "mongoose"

const Schema = mongoose.Schema

const friendRequestSchema = new Schema({
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
},{ timestamps: true });

const FriendRequest = mongoose.model("friendRequest", friendRequestSchema)
export default FriendRequest