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






