import express from "express"
import { sendMessage,  getMessage} from "../controllers/message.controller.js"
import { authenticateUser } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/sendMessage", authenticateUser, sendMessage)

router.get("/:chatId", authenticateUser, getMessage)

export default router 