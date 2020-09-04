'use strict'

const runScripts = () => {
    window.slider()
    window.map()
    window.timer()
    window.beforeAfter()
}

// if (window.addEventListener) {
//     window.addEventListener("DOMContentLoaded", runScripts, false);
// } else if (window.attachEvent) {
//     window.attachEvent("onload", runScripts);
// }

window.onload = () => {
    runScripts()
}
