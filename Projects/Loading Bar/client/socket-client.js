const socket = io()
let isSearching = false

socket.on('connect', () => {
    console.log('connected to server')
})



const findMatchBtn = document.getElementById('find-match')
findMatchBtn.addEventListener('click', () => {
    if (!isSearching) {
        socket.emit('findMatch')
        findMatchBtn.textContent = 'Cancel Search'
        isSearching = true
        updateStatus('Searching for opponent...')
    } else {
        socket.emit('cancelMatch')
        findMatchBtn.textContent = 'Find Match'
        isSearching = false
        updateStatus('Search canceled')
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
            statusElement.classList.add('type')
        }

    })

    statusElement.timeoutId = setTimeout(() => {
        statusElement.textContent = ''
        statusElement.classList.remove(...['searching', 'matched', 'error'])
    }, 4000)


}
