'use strict';

var EmailsInput = (function () {

  var DEFAULT_OPTIONS = {
    pattern: /^[\w.%+-/!#$%&'*=?^_`{|}~]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    cssNamespace: null,
    autofocus: false,
    autocomplete: false,
    maxLength: null,
    placeholder: 'add email by typing here'
  };

  var id = 1;

  var ASSET_SVG_CLOSE_ICON =
    '<svg width="100%" height="100%" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M8 0.8L7.2 0L4 3.2L0.8 0L0 0.8L3.2 4L0 7.2L0.8 8L4 4.8L7.2 8L8 7.2L4.8 4L8 0.8Z" fill="currentColor"/>' +
    '</svg>';


  return function EmailsInput(element, opts) {

    function setNsClassName(className) {
      return options.cssNamespace ? options.cssNamespace + '-' + className : className;
    }

    function validateEmail(email) {
      if (!email) return false;
      if (!options.pattern) return true;
      return options.pattern.test(email);
    }

    function handleKeypress(evt) {
      if (evt.key === ',' || evt.key === 'Enter') {
        evt.preventDefault();
        addItems(inputElement.value);
        inputElement.value = '';
      }
    }

    function handleBlur(evt) {
      if (inputElement.value) {
        addItems(inputElement.value);
        inputElement.value = '';
      }
    }

    function handlePaste(evt) {
      var pastedText = (evt.clipboardData || window.clipboardData).getData('text');

      if (inputElement.value) {
        // If input has any value – prepend it to pasted values
        // May behave in unexpected way as it ignores caret position
        pastedText = inputElement.value + pastedText;
        inputElement.value = '';
      }

      addItems(pastedText);
      evt.preventDefault();
    }

    function renderItems() {
      items.forEach((email) => {
        // Ignore previously rendered items
        if (email.renderedId) return;

        // Compose rendered id for future use
        email.renderedId = instanceId + '-' + ++itemId;

        // Create HTMLDivElement to represent item
        var emailElement = document.createElement('div');
        emailElement.setAttribute('data-item-id', email.renderedId);
        emailElement.classList.add(setNsClassName('emails-input__item'));

        if (!email.valid) {
          emailElement.classList.add(setNsClassName('emails-input__item--invalid'));
        }

        var emailContentElement = document.createElement('span');
        emailContentElement.textContent = email.value;
        emailContentElement.classList.add(setNsClassName('emails-input__item-value'));
        emailElement.append(emailContentElement);

        // Create child button and setup `remove` hook
        var emailRemoveElement = document.createElement('button');
        emailRemoveElement.setAttribute('type', 'button');
        emailRemoveElement.innerHTML = ASSET_SVG_CLOSE_ICON;
        emailRemoveElement.classList.add(setNsClassName('emails-input__remove'));
        emailRemoveElement.addEventListener('click', function () {
          return removeItem(email.renderedId);
        }, false);

        emailElement.append(emailRemoveElement);
        container.insertBefore(emailElement, inputElement);
      });
    }

    function removeItem(itemId) {
      if (!itemId) return;

      var itemElement = container.querySelector('[data-item-id="' + itemId + '"]');
      container.removeChild(itemElement);

      items = items.filter(function (item) {
        return item.renderedId !== itemId;
      });
    }

    function addItems(newValues) {
      // If passed as a string – split by comma into array
      if (!Array.isArray(newValues)) {
        newValues = newValues.split(/\s*,\s*/);
      }

      // Ensure no duplicates are inserted
      var existingValues = items.map(function (item) {
        return item.value;
      });
      var uniqueNewValues = newValues
        .map(function (email) {
          return email && email.trim();
        })
        .filter(function (email) {
          return email && existingValues.indexOf(email) === -1;
        });

      if (uniqueNewValues.length) {
        // Append new values into existing list
        items = items.concat(
          uniqueNewValues.map(function (email) {
            return {
              value: email,
              valid: validateEmail(email),
              renderedId: null
            };
          })
        );

        renderItems();
      }
    }

    function createInput(parentNode, opts) {
      // Create an HTMLInputElement with attributes based on options
      var emailInputElement = document.createElement('input');
      emailInputElement.classList.add(setNsClassName('emails-input__input'));
      emailInputElement.setAttribute('type', 'text');
      emailInputElement.setAttribute('role', 'combobox');
      emailInputElement.setAttribute('autocomplete', false);
      emailInputElement.setAttribute('autocapitalize', 'off');
      emailInputElement.setAttribute('autocorrect', 'off');
      emailInputElement.setAttribute('spellcheck', false);

      if (opts.autofocus) {
        emailInputElement.setAttribute('autofocus', opts.autofocus);
      }

      if (opts.maxLength) {
        emailInputElement.setAttribute('maxLength', opts.maxLength);
      }

      emailInputElement.setAttribute('placeholder', opts.placeholder);

      parentNode.appendChild(emailInputElement);

      // Setup input's event listeners
      emailInputElement.addEventListener('keypress', handleKeypress, false);
      emailInputElement.addEventListener('blur', handleBlur, false);
      emailInputElement.addEventListener('paste', handlePaste, false);

      return emailInputElement;
    }

    var instanceId = 'ei' + id++;
    var itemId = 0;

    var options;

    var container;
    var inputElement;
    var items = [];

    options = Object.assign({}, DEFAULT_OPTIONS, opts);

    if (opts.pattern !== undefined) {
      options.pattern = new RegExp(opts.pattern);
    }

    // Setup parent element
    element.classList.add(setNsClassName('emails-input'));

    // Create and setup child container element
    container = document.createElement('div');
    container.classList.add(setNsClassName('emails-input__container'));
    element.appendChild(container);

    inputElement = createInput(container, options);

    return {
      container: element,

      getValues: function getValues() {},

      add: function add(email) {},

      reset: function reset() {},

      // TODO: Implement subscribe on callback
      // TODO: Implement subscribe on events
      subscribe: function subscribe() {}
    };
  };
})();
