function openTab(tabId) {
    console.log('entered')

    // Hide all the content execpt for the one specified by tabId
    const tab = document.getElementById(tabId)
    const activeTabs = document.getElementsByClassName('active-tab')

    Array.from(activeTabs).forEach((tab) => tab.classList.remove('active-tab'))

    tab.classList.add('active-tab')

    // The Button color will remain the same as the hover state when it's clicked

    Array.from(document.getElementsByTagName('button')).forEach((btn) => btn.classList.remove('active'))
    document.getElementById(`btn-${tabId}`).classList.add('active')


    // Change the image corresponding to the tabId content
    const image = document.getElementsByTagName('img')
    image[0].src = `images/${tabId}.webp`
}