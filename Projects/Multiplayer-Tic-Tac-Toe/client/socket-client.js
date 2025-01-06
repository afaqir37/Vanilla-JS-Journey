const socket = io()
let isSearching = false
let currentRoom = null
let playerSymbol = null
let isYourTurn = false
const gameText = document.getElementById('game-text')
let gameMode = 'online'

function setMode(mode) {
    gameMode = mode
    document.getElementById('online-controls').style.display = gameMode === 'online' ? 'block' : 'none'
    cleanBoard()
}

document.querySelectorAll('rect').forEach((cell) => {
    if (gameMode === 'online') {

        cell.addEventListener('click', (e) => {
            const rect = e.target

            if (isYourTurn && rect.getAttribute("data-state") === 'empty') {
                const position = rect.getAttribute('data-cell')

                socket.emit('makeMove', {
                    roomId: currentRoom,
                    position: position
                })
            }
        })        
    } else {
        cell.addEventListener('click', handleMove); 
    }

})


socket.on('connect', () => {
    console.log('connected to server')
})

socket.on('matchFound', ({ roomId, players, currentPlayer }) => {

    cleanBoard()
    document.querySelector('.restart').style.display = 'none'
    playMatchFoundAudio()
    setFindMatchButton('resign', roomId)


    currentRoom = roomId
    playerSymbol = players[0] === socket.id ? 'X' : 'O'
    isYourTurn = currentPlayer === socket.id
    if (isYourTurn)
        gameText.textContent = 'Your turn!'
    else
        gameText.textContent = 'Your opponent\'s turn!'
    updateStatus(`Match found! You are ${playerSymbol}`, 'matched')
    enableBoard(isYourTurn)
})


socket.on('moveMade', ({ position, nextPlayer }) => {
    const symbol = nextPlayer !== socket.id ? playerSymbol : playerSymbol === 'X' ? 'O' : 'X'
    const cell = document.querySelector(`[data-cell="${position}"]`)
    symbol === 'X' ? drawX(cell) : drawCircle(cell)

    cell.setAttribute("data-state", "occupied")

    isYourTurn = socket.id === nextPlayer
    if (isYourTurn)
        gameText.textContent = 'Your turn!'
    else
        gameText.textContent = 'Your opponent\'s turn!'
    enableBoard(isYourTurn)
})

socket.on('gameOver', ({ type, winner} ) => {
    const isWinner = winner === socket.id
    
    if (type === 'win') {
        if (isWinner) {
            congrats()
            updateStatus('You won! 🎉', 'matched')
        } else {
            updateStatus('You lost!', 'error')
        }
    }

    gameText.textContent = ''
    document.querySelector('.grid').style.pointerEvents = 'none'
    document.querySelector('.restart').style.display = 'block'
    setFindMatchButton('default')
})



function updateStatus(msg, type = 'default') {
    const statusElement = document.getElementById('status')
    let timeoutId;

    if (statusElement.timeoutId) {
        clearTimeout(statusElement.timeoutId)
    }

    requestAnimationFrame(() => {
        statusElement.textContent = msg

        const classes = ['searching', 'matched', 'error']
        statusElement.classList.remove(...classes)

        if (type !== 'default') {
            statusElement.classList.add(type)
        }

    })

    statusElement.timeoutId = setTimeout(() => {

        if (type !== 'searching')
            statusElement.textContent = ''
        statusElement.classList.remove(...['matched', 'error'])
    }, 4000)

}


function enableBoard(isYourTurn) {
    document.getElementsByClassName('grid')[0].style.pointerEvents = isYourTurn ? 'auto' : 'none'
    
}

function playMatchFoundAudio() {
    const audio = new Audio('./matchFound')
    audio.play()
}