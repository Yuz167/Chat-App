import express from "express"
import { createChat, getChat } from "../controllers/chat.controller.js"
import { authenticateUser } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/createChat", authenticateUser, createChat)

router.get("/getChat", authenticateUser, getChat)

export default router 