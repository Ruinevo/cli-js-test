'use strict'; // polyfills

var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }

    return target;
}; // error class name


var ERROR_CLASS = 'cli-form-field-msg'; // const BASE_API = 'https://builder-api.hostman.site/api/forms'
// validate.js settings

var error_message = '^Обязательное поле';
var FIELDS_PATTERNS = {
    text: {
        length: {
            minimum: 2,
            message: error_message
        }
    },
    tel: {
        numericality: {
            message: error_message
        }
    },
    email: {
        email: {
            message: error_message
        }
    }
}; // create new DOM element

var getNewElement = function getNewElement(tag, classes, content) {
    var el = document.createElement(tag);
    classes.forEach(function (className) {
        el.classList.add(className);
    });
    el.textContent = content;
    return el;
}; // format user link to internal link


var convertLinkToPage = function convertLinkToPage(url) {
    if (url.startsWith('/')) {
        return "".concat(url.slice(1));
    } else {
        return "".concat(url);
    }
}; // format user link to external link


var convertLinkToSite = function convertLinkToSite(url) {
    if (url.startsWith('http')) {
        return url;
    } else {
        return "http://".concat(url);
    }
};

var redirectTo = function redirectTo(url) {
    return window.location.href = url;
}; // hide or show DOM element


var toggle = function toggle(el, isPopup) {
    if (isPopup) {
        el.classList.toggle('cli-hide-popup');
        el.classList.toggle('cli-show-popup');
    } else {
        el.style.display = el.style.display === 'none' ? 'block' : 'none';
    }
};

var form = function form() {
    var forms = document.querySelectorAll('[data-script="form"]');
    var body = document.body;
    forms.forEach(function (form) {
        // использовать после прохождения тестирования 531 задачи на проде
        // const message = form.closest('[data-block-container]').querySelector('[data-script="message"]');
        var message = form.closest('[data-block-container]') ? form.closest('[data-block-container]').querySelector('[data-script="message"]') : null; // пока не используется
        // const popup = form.closest('[data-block-container]').querySelector('[data-script="popup"]')

        var dataOptions = JSON.parse(form.dataset.formOptions);
        var dataContent = JSON.parse(form.dataset.formContent);
        var fieldsSettings = dataContent.fields;
        var _dataOptions$action = dataOptions.action,
            actionType = _dataOptions$action.action_type,
            redirect = _dataOptions$action.redirect;
        var formId = form.id;
        var url = '';

        if (actionType === 'redirect_to_page') {
            url = convertLinkToPage(redirect);
        } else if (actionType === 'redirect_to_site') {
            url = convertLinkToSite(redirect);
        } // settings for valudate.js https://validatejs.org/


        var constraints = {};
        fieldsSettings.filter(function (f) {
            return !f.hidden;
        }).forEach(function (s) {
            constraints[s.type] = Object.assign({}, FIELDS_PATTERNS[s.type]);
            constraints[s.type].presence = s.required;
        }); // show message after success submit

        var showMessage = function showMessage(messageBlock, form) {
            var block = form.closest('[data-block]');
            var popup = form.closest('[data-popup]');
            var agreeButton = messageBlock.querySelector('[data-message-btn]');
            var closeButton = messageBlock.querySelector('[data-message-close]');

            var handler = function handler() {
                if (!popup) {
                    toggle(block, popup);
                } else {
                    unsetBodyStyles();
                    closeButton.removeEventListener('click', handler);
                }

                toggle(messageBlock, popup);
                agreeButton.removeEventListener('click', handler);
                form.reset();
            };

            toggle(block, popup);
            toggle(messageBlock, popup);
            agreeButton.addEventListener('click', handler);

            if (popup) {
                closeButton.addEventListener('click', handler);
                popup.style.display = 'none';
            }
        };

        var fields = Array.from(form.querySelectorAll('[data-form-field] input')); // clean up errors when input

        fields.forEach(function (field) {
            field.required = fieldsSettings.find(function (f) {
                return f.id === field.dataset.id;
            }).required;
            field.addEventListener('input', function () {
                var parent = field.parentNode;
                var errorEl = parent.querySelector(".".concat(ERROR_CLASS));

                if (errorEl) {
                    parent.removeChild(errorEl);
                    parent.classList.remove('error');
                }
            });
        });

        var sendMessage = async function sendMessage() {
            var headers = {
                PublicId: formId,
                'Content-Type': 'application/json;charset=UTF-8'
            }; // используется для передачи скрытого value, например в goods блоках --> это товар под кнопкой "Заказать"

            var hiddenField = fieldsSettings.filter(function (f) {
                return f.hidden;
            })[0];
            var body = {};
            fields.forEach(function (field) {
                var fieldId = field.dataset.id;

                if (field.type !== 'radio') {
                    body[fieldId] = field.value;
                } else {
                    field.checked ? body[fieldId] = field.value : null;
                }
            });

            if (hiddenField && form.dataset.order) {
                body[hiddenField.id] = form.dataset.order;
            }

            var response = await fetch(window.formApi, {
                method: "POST",
                body: JSON.stringify(body),
                headers: headers
            });

            if (response.ok) {
                form.dataset.order = '';
            }

            form.reset();
        }; // actions for user choise


        var mapTypeToAction = {
            'show_message': function show_message() {
                return showMessage(message, form);
            },
            // пока не используется
            // 'show_popup': () => showMessage(popup, form),
            'redirect_to_page': function redirect_to_page() {
                return redirectTo(url);
            },
            'redirect_to_site': function redirect_to_site() {
                return redirectTo(url);
            }
        };
        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            var validateSettings = {};
            fields.forEach(function (field) {
                validateSettings[field.type] = field.value; // Если поле пустое, но не обязательное,
                // то разрешаем пустое поле и убираем правила валидации

                if (field.value.length === 0 && (!constraints[field.type].presence || constraints[field.type].presence.allowEmpty)) {
                    constraints[field.type] = {
                        presence: {
                            allowEmpty: true
                        }
                    }; // Если поле пустое, но обязательное,
                    // то меняем текст ошибки
                } else if (field.value.length === 0 && constraints[field.type].presence) {
                    switch (field.type) {
                        case 'text':
                            constraints[field.type].length.message = 'Обязательное поле';
                            break;

                        case 'tel':
                            constraints[field.type].numericality.message = 'Обязательное поле';
                            break;

                        case 'email':
                            constraints[field.type].email.message = 'Обязательное поле';
                            break;
                    } // Если поле не пустое или обязательное, то прописываем правила валидации

                } else {
                    var fieldSetting = fieldsSettings.find(function (e) {
                        return e.type === field.type;
                    });
                    constraints[field.type] = Object.assign({}, FIELDS_PATTERNS[field.type]);
                    constraints[field.type].presence = fieldSetting.hasOwnProperty('required');
                }
            });
            var validationResult = validate(validateSettings, constraints);

            if (!validationResult) {
                await sendMessage();
                var func = mapTypeToAction[actionType];
                if (func) func();
            } else {
                fields.forEach(function (field) {
                    if (field.required) {
                        var type = field.type;
                        if (!validationResult[type]) return;
                        var _message = validationResult[type][0];
                        var errorEl = getNewElement('div', [ERROR_CLASS], _message);
                        var parent = field.parentNode;
                        var oldError = parent.querySelector(".".concat(ERROR_CLASS));

                        if (oldError) {
                            parent.replaceChild(errorEl, oldError);
                        } else {
                            parent.appendChild(errorEl);
                        }

                        parent.classList.add('error');
                    }
                });
            }
        });

        function unsetBodyStyles() {
            scrollY = body.style.top;
            body.style.position = '';
            body.style.top = '';
            body.style.width = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    });
};

if (window.constructorCliFunc) {
    window.constructorCliFunc.form = form;
} else {
    var constructorCliFunc = {
        form: form
    };
    window.constructorCliFunc = constructorCliFunc;
}
