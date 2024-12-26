const progress = document.getElementsByClassName('progress')
const percentage = document.getElementById('percentage')

const interval = setInterval(updateProgress, 100);
let width = 0


function updateProgress() {

    if (width == 100)
        clearInterval(interval)

    progress[0].style.width = width + '%'
    percentage.textContent = width 

    width++
}

