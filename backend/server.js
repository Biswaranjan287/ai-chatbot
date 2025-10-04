require('dotenv').config();
const app = require('./src/app');
const { createServer } = require("http");
const { Server } = require("socket.io");
const generateResponse = require("./src/service/ai.service");
const { text } = require('stream/consumers');


const httpServer = createServer(app);
const io = new Server(httpServer, {

    cors: {
        origin: "https://chatbot-rlmk.onrender.com", // Adjust 
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

const PORT = process.env.PORT || 3000; // Use Render's port, default to 3000 locally

httpServer.listen(PORT, '0.0.0.0', () => { // Bind to 0.0.0.0 for external access
    console.log(`Server is running on port ${PORT}`);
});