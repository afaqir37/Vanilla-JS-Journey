const total = document.getElementById('total-counter')
const remaining = document.getElementById('remaining')
const textarea = document.getElementById('textarea')


const CHAR_LIMIT = 50

let totalCharacters = 0
let remainingCharacters = CHAR_LIMIT

total.textContent = totalCharacters
remaining.textContent = remainingCharacters

textarea.addEventListener('input', () => {

    totalCharacters = textarea.value.length;
    remainingCharacters = CHAR_LIMIT - totalCharacters


    total.textContent = totalCharacters
    remaining.textContent = remainingCharacters


setTimeout(() => {
    if (remainingCharacters == 0) {
        alert('You have exceeded the limit!')
        //return
    }
}, 0)

})
