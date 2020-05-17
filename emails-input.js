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

  return function EmailsInput(element, opts) {

    function setNsClassName(className) {
      return options.cssNamespace ? options.cssNamespace + '-' + className : className;
    }

    function validateEmail(email) {
      if (!email) return false;
      if (!options.pattern) return true;
      return options.pattern.test(email);
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
        emailRemoveElement.innerHTML = '&times;';
        emailRemoveElement.classList.add(setNsClassName('emails-input__remove'));
        // TODO: add removeItem click handler

        emailElement.append(emailRemoveElement);
        container.insertBefore(emailElement, inputElement);
      });
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

      // TODO: Setup input's event listeners

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
