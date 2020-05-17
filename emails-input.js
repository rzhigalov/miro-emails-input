'use strict';

var EmailsInput = (function () {

  var DEFAULT_OPTIONS = {
    cssNamespace: null
  };

  return function EmailsInput(element, opts) {

    function setNsClassName(className) {
      return options.cssNamespace ? options.cssNamespace + '-' + className : className;
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
