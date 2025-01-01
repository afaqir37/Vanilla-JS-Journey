const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const path = require('path')


const app = express()
const server = http.createServer(app)
const io = new Server(server)
const port = 3000

app.use(express.static(path.join(__dirname, '..', 'client')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname ,'index.html'))
})

const waitingPlayers = new Set()
const rooms = new Map()

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], //rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], //columns
    [0, 4, 8], [2, 4, 6] //diagonals
]

io.on('connection', (socket) => {

    console.log('A user connected')

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg)
    })

    socket.on('disconnect', () => {
        console.log('a user is disconnected')
    })


    socket.on('findMatch', () => {
        console.log('Player looking for match: ', socket.id)

        if (waitingPlayers.size > 0) {
            // Get the first waiting player
            console.log('matched...')
            const opponent = waitingPlayers.values().next().value
            waitingPlayers.delete(opponent)

            // Create a new room for these two players
            const roomId = generateRoomId()
            const room = {
                players: [opponent, socket.id],
                currentPlayer: opponent,
                board: Array(9).fill(null),
                gameState: 'playing'
            }
            rooms.set(roomId, room)

            //Make both players join the room
            socket.join(roomId)
            io.sockets.sockets.get(opponent)?.join(roomId)

            io.to(roomId).emit('matchFound', {
                roomId,
                players: room.players,
                currentPlayer: room.currentPlayer
            })

        } else {
            waitingPlayers.add(socket.id)
            socket.emit('waitingForMatch')
        }


    })



    socket.on('makeMove', ({ roomId, position }) => {
        const room = rooms.get(roomId)
        if (!room || room.currentPlayer !== socket.id)
            return

        room.currentPlayer = room.players.find(id => id != socket.id)

        io.to(roomId).emit('moveMade', ({
            position,
            nextPlayer: room.currentPlayer
        }))

        // Check for Win or Tie
        const symbol = room.players[0] === socket.id ? 'X' : 'O'
        room.board[position - 1] = symbol

        const isWin = checkWin(room.board, symbol)
        const isTie = !room.board.includes(null)

        if (isWin || isTie) {
            io.to(roomId).emit('gameOver', ({
                type: isWin ? 'win' : 'tie',
                winner: isWin ? socket.id : null
            }))
            
            return
        }



    })

   socket.on('playerResigned', ({ roomId }) => {
        const room = rooms.get(roomId)
        if (room) {
            io.to(roomId).emit('gameOver', ({
                type: 'win',
                winner: room.players.find(id => id !== socket.id)
            }))
        }

        rooms.delete(roomId)
   }) 

    


    socket.on('cancelMatch', () => {
        waitingPlayers.delete(socket.id)
        socket.emit('matchCanceled')
    })


    socket.on('disconnect', () => {
        //Remove from waiting list if they were waiting
        waitingPlayers.delete(socket.id)

        // Handle disconnection from active games

        for (const [roomId, room] of rooms.entries()) {
            if (room.players.includes(socket.id)) {
                io.to(roomId).emit('playerDisconnected')
                rooms.delete(roomId)
            }
        }
    })


})

server.listen(port, () => {
    console.log('Server is running....')
    console.log(Date.now())
})


function generateRoomId() {
    return `room_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
}

function checkWin(board, symbol) {
    
    return winPatterns.some(pattern => {
        return pattern.every(index => board[index] === symbol)
    })
}