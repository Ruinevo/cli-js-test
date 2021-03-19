"use strict";

var handleAnchor = function handleAnchor() {
  console.log(1)
  var buttons = Array.from(document.querySelectorAll('[data-anchor]:not([data-anchor=""])'));
  console.log(buttons)
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var uuid = btn.dataset.anchor;
      var blocks = Array.from(document.querySelectorAll('[data-style]'));
      console.log(blocks)
      var target = blocks.find(function (b) {
        return b.dataset.style.includes(uuid);
      });
      var targetForm = target.querySelector('[data-script="form"]'); // проверяем, есть ли в привязанном блоке элемент Форма
      // если есть - скорее всего мы хотим запомнить товар/услугу, который как бы заказываем
      // * актуально для goods блоков, где есть кнопка "Заказать"

      if (targetForm) {
        var dataOrder = btn.closest('[data-order]:not([data-order=""])');

        if (dataOrder) {
          var orderValue = dataOrder.dataset.order;
          targetForm.dataset.order = orderValue;
        }
      }

      var bodyRect = document.body.getBoundingClientRect();
      var rect = target.getBoundingClientRect();
      var offset = rect.top - bodyRect.top;
      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });
    });
  });
};

var popup = function popup() {
  var buttons = Array.from(document.querySelectorAll('[data-popup]:not([data-popup=""])'));
  var uniquePopups = [];
  var body = document.body;
  var scrollY;

  var toggleClasses = function toggleClasses(element) {
    element.classList.toggle('cli-hide-popup');
    element.classList.toggle('cli-show-popup');

    if (element.classList.contains('cli-show-popup')) {
      element.style.display = 'flex';
    } else if (element.classList.contains('cli-hide-popup')) {
      element.style.display = 'none';
    }
  };

  buttons.forEach(function (button) {
    var popupUuid = button.dataset.popup;
    var blocks = Array.from(document.querySelectorAll('[data-style]'));
    var target = blocks.find(function (b) {
      return b.dataset.style.includes(popupUuid);
    }).querySelector('[data-hide-element]');
    var closeButton = target.querySelector('[data-popup-close]');
    var targetForm = target.querySelector('[data-script="form"]');
    var dataAttribute = ['[data-popup-body]', '[data-script="message"]', '[data-popup-close]', '[data-video-btn]'];
    target.style.display = 'none';

    if (!uniquePopups.includes(popupUuid)) {
      target.addEventListener('click', function (e) {
        var checkAttribute = dataAttribute.map(function (item) {
          return !!e.target.closest(item);
        });

        if (!checkAttribute.includes(true)) {
          toggleClasses(target);
        }
      });
      closeButton.addEventListener('click', function () {
        toggleClasses(target);
      });
      uniquePopups.push(popupUuid);
    }

    button.addEventListener('click', function (e) {
      e.preventDefault();
      toggleClasses(target);

      if (targetForm) {
        var dataOrder = button.closest('[data-order]:not([data-order=""])');

        if (dataOrder) {
          var orderValue = dataOrder.dataset.order;
          targetForm.dataset.order = orderValue;
        }
      }
    });
  });
};

handleAnchor();


