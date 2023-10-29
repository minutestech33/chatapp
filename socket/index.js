const { Server } = require('socket.io')

const io = new Server({ cors: "http://localhost:5173" })

const users = {}

io.on("connection", (socket) => {
    console.log("new connection", socket.id)

    socket.on("loginNewUser", (userId) => {
        users[userId] = socket
    })

    socket.on("sendMessage", (data) => {
        const receiverSocket = users[data.reciverId];

        if (receiverSocket) {
            receiverSocket.emit("getMessage", data)
        }
    })

    socket.on("disconnect", () => {
        console.log("Disconnected!")
    })
})

io.listen(9090)