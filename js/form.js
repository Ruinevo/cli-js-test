'use strict'

// класс сообщения об ошибке
const ERROR_CLASS = 'cli-form-field-msg'

const BASE_API = 'https://builder-api.hostman.site/api/forms'

// настройки валидации по типу поля validate.js
const FIELDS_PATTERNS = {
  text: {
    length: {
      minimum: 2,
      message: '^Введите Ваше имя'
    }
  },
  tel: {
    numericality: {
      message: '^Введите корректный номер телефона'
    }
  },
  email: {
    email: {
      message: "^Введите корректный Email"
    }
  }
}


// create new DOM element
const getNewElement = (tag, classes, content) => {
  const el = document.createElement(tag)
  el.classList.add(...classes)
  el.textContent = content
  return el
}

// format user link to internal link
const convertLinkToPage = (url) => {
  if (url.startsWith('/')) {
    return `${url.slice(1)}.html`
  } else {
    return `${url}.html`
  }
}

// format user link to external link
const convertLinkToSite = (url) => {
  if (url.startsWith('http')) {
    return url
  } else {
    return `http://${url}`
  }
}

const redirectTo = (url) => window.location.href = url;

// hide or show DOM element
const toggle = (el) => {
  el.style.display = el.style.display === 'none' ? 'block' : 'none'
}

window.form = () => {
  const forms = document.querySelectorAll('[data-script="form"]')
  forms.forEach(form => {
    const message = form.closest('[data-style]').querySelector('[data-script="message"]')
    const popup = form.closest('[data-style]').querySelector('[data-script="popup"]')
    const dataOptions = JSON.parse(form.dataset.formOptions)
    const dataContent = JSON.parse(form.dataset.formContent)
    const fieldsSettings = dataContent.fields
    const { action_type:actionType, redirect } = dataOptions.action
    const formId = form.id

    let url = ''

    if (actionType === 'redirect_to_page') {
      url = convertLinkToPage(redirect)
    } else if (actionType === 'redirect_to_site') {
      url = convertLinkToSite(redirect)
    }

    // settings for valudate.js https://validatejs.org/
    const constraints = {}

    fieldsSettings.forEach(s => {
      constraints[s.type] = {
        presence: s.required,
        ...FIELDS_PATTERNS[s.type]
      }
    })

    // show message after success submit
    const showMessage = (messageBlock, form) => {
      const block = form.closest('.cli-form')
      toggle(block)
      toggle(messageBlock)
      const btn = messageBlock.querySelector('a.cli-btn')
      const handler = () => {
        toggle(block)
        toggle(messageBlock)
        form.reset()
        btn.removeEventListener('click', handler)
      }
      btn.addEventListener('click', handler)
    }

    const fields = Array.from(form.querySelectorAll('.cli-form-field input'))

    // clean up errors when input
    fields.forEach(field => {
      field.addEventListener('input', () => {
        const parent = field.parentNode
        const errorEl = parent.querySelector(`.${ERROR_CLASS}`)
        if (errorEl) {
          parent.removeChild(errorEl)
          parent.classList.remove('error')
        }
      })
    })

    const sendMessage = async () => {
      const headers = {
        PublicId: formId,
        'Content-Type': 'application/json;charset=UTF-8'
      }
      const body = {}
      fields.forEach(field => {
        body[field.type] = field.value
      })
      const response = await fetch(BASE_API, {
        method: "POST",
        body: JSON.stringify(body),
        headers
      })
      if (!response.ok) {
        form.reset()
      }
    }



    // actions for user choise
    const mapTypeToAction = {
      'show_message': () => showMessage(message, form),
      'show_popup': () => showMessage(popup, form),
      'redirect_to_page': () => redirectTo(url),
      'redirect_to_site': () => redirectTo(url)
    }


    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      const validateSettings = {}
      fields.forEach(field => {
        validateSettings[field.type] = field.value
      })

      const validationResult = validate(validateSettings, constraints);

      if (!validationResult) {
        await sendMessage()
        mapTypeToAction[actionType]()
      } else {
        fields.forEach(field => {
          const type = field.type
          if (!validationResult[type]) return
          const message = validationResult[type][0]
          const errorEl = getNewElement('div', [ERROR_CLASS], message)
          const parent = field.parentNode
          const oldError = parent.querySelector(`.${ERROR_CLASS}`)
          if (oldError) {
            parent.replaceChild(errorEl, oldError)
          } else {
            parent.appendChild(errorEl)
          }
          parent.classList.add('error')
        })

      }
    })
  })

}
