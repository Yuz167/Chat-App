import {Server} from "socket.io"
import http from "http"
import express from "express"

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors:{
        origin: ["http://localhost:5173"]
    }
})

const onlineUsers = {}

export const getReciverSocketId = (id) => {
    return onlineUsers[id]
}

io.on("connection", (socket) => {
    console.log("A user connected", socket.id)
    const userId = socket.handshake.query.userId
    if(userId) onlineUsers[userId] = socket.id

    socket.on("disconnet", () => {
        console.log("A user disconnected", socket.id)
        delete onlineUsers[userId];
    })
})

export {io, app, server}