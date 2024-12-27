const progress = document.getElementsByClassName('progress')
const percentage = document.getElementById('percentage')

//let interval = setInterval(updateProgress, 50);
let width = 0


function updateProgress() {

    if (width == 100) {
        clearInterval(interval)
    }

    if (width != 100 && width >= 90) {
        clearInterval(interval)
        interval = setInterval(updateProgress, 100)
    }

    if (width != 100 && width >= 97) {
        clearInterval(interval)
        interval = setInterval(updateProgress, 300)
    }

    if (width != 100 && width == 99) {
        clearInterval(interval)
        interval = setInterval(updateProgress, 700)
    }
    progress[0].style.width = width + '%'
    percentage.textContent = width 

    width++
}


// TIC-TAC-TOE Section

let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
]



let currentPlayer = 'X'
let isGameOver = false

document.querySelectorAll('rect').forEach((cell) => {
    cell.addEventListener('click', handleMove);
})


const drawCircle = (cell) => {
    const cx = parseFloat(cell.getAttribute('x')) + cell.getAttribute('width') / 2
    const cy = parseFloat(cell.getAttribute('y')) + cell.getAttribute('height') / 2

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    circle.setAttribute('cx', cx)
    circle.setAttribute('cy', cy)
    circle.setAttribute('r', 30)
    circle.setAttribute('stroke', 'red')
    circle.setAttribute('stroke-width', '3')
    circle.setAttribute('fill', 'transparent')
    console.log(circle)
    document.querySelector('svg').appendChild(circle)
    cell.setAttribute('data-state', 'occupied')
}

const drawX = (cell) => {
    const cx = parseFloat(cell.getAttribute('x')) + cell.getAttribute('width') / 2
    const cy = parseFloat(cell.getAttribute('y')) + cell.getAttribute('height') / 2
    const size = cell.getAttribute('width') / 4

    const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line1.setAttribute('x1', cx - size)
    line1.setAttribute('y1', cy - size)
    line1.setAttribute('x2', cx + size)
    line1.setAttribute('y2', cy + size)
    line1.setAttribute('stroke', 'blue')
    line1.setAttribute('stroke-width', '4')
    document.querySelector('svg').appendChild(line1)

    const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line2.setAttribute('x1', cx + size)
    line2.setAttribute('y1', cy - size)
    line2.setAttribute('x2', cx - size)
    line2.setAttribute('y2', cy + size)
    line2.setAttribute('stroke', 'blue')
    line2.setAttribute('stroke-width', '4')
    
    document.querySelector('svg').appendChild(line2)

    cell.setAttribute('data-state', 'occupied')
    
}

const checkWinner = () => {
    for (let i = 0; i < 3; i++) {
        if (board[i][0] == board[i][1] && board[i][1] == board[i][2] && board[i][2] != '') {
            alert(`${board[i][0]} wins!`)
            return true
        }

        if (board[0][i] == board[1][i] && board[1][i] == board[2][i] && board[2][i] != '') {
            alert(`${board[0][i]} wins!`)
            return true
        }

    }

    if (board[0][0] == board[1][1] && board[1][1] == board[2][2] && board[2][2] != '') {
        alert(`${board[0][0]} wins!`)
        return true
    }

    if (board[0][2] == board[1][1] && board[1][1] == board[2][0] && board[2][0] != '') {
        alert(`${board[0][0]} wins!`)
        return true

    }

    return false
}

function handleMove(event) {
    if (isGameOver)
        return

    console.log('entered')
    const rect = event.target
    const x = parseInt(rect.getAttribute('x')) / rect.getAttribute('width')
    const y = parseInt(rect.getAttribute('y')) / rect.getAttribute('width')
    
    if (rect.getAttribute('data-state') === 'empty') {
        console.log('ok')
        if (currentPlayer === 'X') {

            drawX(rect)
            board[y][x] = 'X'
            
           currentPlayer = 'O'
        }

        else if (currentPlayer === 'O') {

            drawCircle(rect)
            board[y][x] = 'O'

            currentPlayer = 'X'
        }

        setTimeout(() => {
            if (checkWinner())
                isGameOver = true
        }, 100)

    } else {
        console.log('This cell is already occupied')
    }
}







