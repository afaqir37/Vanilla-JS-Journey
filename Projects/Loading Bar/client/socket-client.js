const socket = io()
let isSearching = false
let currentRoom = null
let playerSymbol = null

socket.on('connect', () => {
    console.log('connected to server')
})

socket.on('matchFound', ({ roomId, players, currentPlayer }) => {
    currentRoom = roomId
    playerSymbol = players[0] === socket.id ? 'X' : 'O'
    updateStatus(`Match found! You are ${playerSymbol}`, 'matched')
    enableBoard(currentPlayer === socket.id)
})



const findMatchBtn = document.getElementById('find-match')
findMatchBtn.addEventListener('click', () => {
    if (!isSearching) {
        socket.emit('findMatch')
        findMatchBtn.textContent = 'Cancel Search'
        isSearching = true
        updateStatus('Searching for opponent...', 'searching')
    } else {
        socket.emit('cancelMatch')
        findMatchBtn.textContent = 'Find Match'
        isSearching = false
        updateStatus('Search canceled', 'error')
    }
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