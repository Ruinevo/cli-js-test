
  
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

      const links = Array.from(w.querySelectorAll('.cli-header-menu a'))
      const location = window.location.href;
      const activeLink = links.find(l => l.href === location)
      if (activeLink) {
        activeLink.classList.add('active')
      }
    })
  }
  
  
  
  
  