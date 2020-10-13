
  
  window.menu = () => {
    const wrappers = Array.from(document.querySelectorAll('.cli-header'))
    wrappers.forEach(w => {
        const content = w.querySelector('.cli-header-content')
        const [close, open] = w.querySelectorAll('.cli-header-menu-btn')
        open.addEventListener('click', () => {
            content.classList.add('cli-mobile-menu')
        })
        close.addEventListener('click', () => {
          content.classList.remove('cli-mobile-menu')
      })
    })
  }
  
  
  
  
  