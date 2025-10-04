require('dotenv').config();
const app = require('./src/app');
const { createServer } = require("http");
const { Server } = require("socket.io");
const generateResponse = require("./src/service/ai.service");
const { text } = require('stream/consumers');


const httpServer = createServer(app);
const io = new Server(httpServer, {

    cors: {
        origin: "http://localhost:5173", // Adjust 
    }

});

const chatHistory = [

]

io.on("connection", (socket) => {
    console.log("A user connected")

    socket.on("disconnect", () => {
        console.log("A user disconnected")
    });

    /* ai-message */

    socket.on('ai-message', async (data) => {
        console.log("Ai message received:", data);

        chatHistory.push({
            role: "user",
            parts: [ { text: data } ]
        });

        const mama = await generateResponse(chatHistory)

        chatHistory.push({
            role: "model",
            parts: [ { text: mama } ]
        });

        socket.emit("ai-message-response", mama)

    })



});

httpServer.listen(3000, () => {
    console.log('Server is running on port 3000');
})