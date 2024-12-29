const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const path = require('path')


const app = express()
const server = http.createServer(app)
const io = new Server(server)
const port = 3000

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

io.on('connection', (socket) => {

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg)
    })

    socket.on('disconnect', () => {
        console.log('a user is disconnected')
    })
})

server.listen(port, () => {
    console.log('Server is running....')
})
