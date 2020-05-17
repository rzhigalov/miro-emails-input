'use strict';

var EmailsInput = (function () {

  var DEFAULT_OPTIONS = {

  };

  return function EmailsInput(element, opts) {

    var options;

    options = Object.assign({}, DEFAULT_OPTIONS, opts);

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
