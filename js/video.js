const BASE = 'https://www.youtube.com/embed/'
const LINK_PARAMS = '?enablejsapi=1&version=3&playerapiid=ytplayer&playlist=90B2L4hSXYw&mute=1&start=1&autoplay=1&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&controls=0'

const containers = Array.from(document.querySelectorAll('[data-video]'))

containers.forEach(container => {
  const videoId = container.dataset.video
  const iframe = document.createElement('iframe')
  iframe.src = BASE + videoId + LINK_PARAMS
  container.appendChild(iframe)

  const parent = container.parentNode

  const btn = parent.querySelector('.cli-video-btn')
  const text = parent.querySelector('.show')

  btn.addEventListener('click', () => {
    const parent = container.parentNode
    const isPlaying = !parent.classList.contains('pause')
    const rule = isPlaying ? 'pauseVideo' : 'playVideo'
    iframe.contentWindow.postMessage('{"event":"command","func":"' + rule + '","args":""}', '*')
    parent.classList.toggle('pause')
    const isShow = text.style.display
    text.style.display = isShow === 'block' ? 'none' : 'block'
  })
})





