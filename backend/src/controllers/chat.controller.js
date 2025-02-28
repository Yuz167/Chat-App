import Chat from "../models/chat.model.js"

export const createChat = async(req, res) => {
    const {participant1, participant2} = req.body

    if(!participant1 || !participant2){
        return res.status(400).json({error:true, message:"Something is wrong"})
    }

    try{
        const haveChat = await Chat.findOne({
            $or: [
              { participant1, participant2 },
              { participant1: participant2, participant2: participant1 }
            ]
        })
        
        if(haveChat){
            return res.status(400).json({error:true, message:"You guys already have a chat!"})
        }

        const newChat = new Chat({
            ...req.body
        })
        await newChat.save()

        return res.json({
            error:false,
            newChat,
            message:"Success"
        })

    }catch(error){
        return res.status(500).json({error:true, message:"Internal Server Error"})
    }
}

export const getChat = async(req, res) => {
    const currentUser = req.user._id
    if(!currentUser) return res.status(400).json({error:true, message:"Missing current user"})

    try{
        const chats = await Chat.find({
            $or: [
                {participant1:currentUser},
                {participant2:currentUser}
            ]
        })

        if(!chats) return res.status(400).json({error:true, message:"Something went wrong when retriving chats"})

        return res.json({
            error:false,
            message:"Success",
            chats
        })
    }catch(error){
        return res.status(500).json({error:true, message:"Internal Server Error"})
    }
}