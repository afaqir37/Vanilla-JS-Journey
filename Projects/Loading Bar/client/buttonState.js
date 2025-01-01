const findMatchButton = document.getElementById('find-match')

findMatchButton.addEventListener('click', defaultEvent)

function defaultEvent() {
    if (!isSearching) {
        startSearch()
    } else {
        cancelSearch()
    }    
}


function startSearch() {
    socket.emit('findMatch')
    setFindMatchButton('cancelSearch')
    updateStatus('Searching for opponent...', 'searching')
}

function resign(roomId) {
    console.log("this is it: ", roomId)
    socket.emit('playerResigned', ({ roomId }))
    setFindMatchButton('default')
}

function cancelSearch() {
    socket.emit('cancelMatch')
    setFindMatchButton('default')
    updateStatus('Search canceled', 'error')
}


function setFindMatchButton(state, roomId = null) {
    switch(state) {
        case 'cancelSearch':
            findMatchButton.textContent = 'Cancel Search'
            findMatchButton.removeEventListener('click', defaultEvent)
            findMatchButton.onclick = cancelSearch
            isSearching = true
            break
        case 'resign':
            findMatchButton.textContent = 'Resign'
            findMatchButton.removeEventListener('click', cancelSearch)
            findMatchButton.removeEventListener('click', startSearch)
            findMatchButton.onclick = () => resign(roomId)
            isSearching = false
            break
        default:
            findMatchButton.textContent = 'Find Match'
            findMatchButton.removeEventListener('click', cancelSearch)
            findMatchButton.onclick = startSearch
            isSearching = false
    }
}