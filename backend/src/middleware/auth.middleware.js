import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const authenticateUser = async (req, res, next) => {
    try{
        const token = req.cookies.jwt
        if(!token){
            return res.status(401).json({
                error:true,
                message: "Unauthorized - No Token Provided"
            })
        }
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err,decoded)=>{
            if(err){
                return res.sendStatus(401)
            }
            const user = await User.findById(decoded.userId).select("-password")
            //console.log(user)
            if(!user) {return res.status(404).json({error:true, message: "User not found"})}
            req.user = user
            next()
        })
    }catch(error){
        console.log(error.message)
        return res.status(500).json({error:true, message: "Internal Server Error"}) 
    }
}