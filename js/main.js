'use strict'

const init = () => {
    window.slider()
    window.map()
    window.timer()
    window.beforeAfter()
}

if (document.readyState == 'complete') {
    init()
} else {
    window.addEventListener('load', () => {
        init()
    })
}

