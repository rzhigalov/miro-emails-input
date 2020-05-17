'use strict';

var EmailsInput = (function () {

  var DEFAULT_OPTIONS = {
    cssNamespace: null,
    autofocus: false,
    autocomplete: false,
    maxLength: null,
    placeholder: 'add email by typing here'
  };

  return function EmailsInput(element, opts) {

    function setNsClassName(className) {
      return options.cssNamespace ? options.cssNamespace + '-' + className : className;
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

    var container;
    var options;

    options = Object.assign({}, DEFAULT_OPTIONS, opts);

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
