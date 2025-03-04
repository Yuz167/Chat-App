import express from "express"
import { checkAuth, login, logout, signup, getUsers, sendFriendRequest, getFriendRequests, getIndividulUser, deleteFriendRequest } from "../controllers/auth.controller.js"
import { authenticateUser } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/signup", signup)

router.post("/login", login)

router.post("/logout", logout)

router.post("/sendFriendRequest", authenticateUser, sendFriendRequest)

router.post("/deleteFriendRequest", authenticateUser, deleteFriendRequest)

router.get("/getFriendRequests", authenticateUser, getFriendRequests)

router.get("/getUsers", authenticateUser, getUsers)

router.get("/getIndividulUser/:userId", authenticateUser, getIndividulUser)

router.get("/check", authenticateUser, checkAuth)
export default router 