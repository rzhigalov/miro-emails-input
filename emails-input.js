'use strict';

var EmailsInput = (function () {
  /**
   * An EmailsInput Options object
   * @typedef EmailsInputOptions
   * @type {object}
   * @property {string}         pattern RegExp pattern to validate emails.
   * @property {boolean}        embedCSS Enables runtime stylesheet embedding.
   * @property {string | null}  cssNamespace CSS classes prefix.
   * @property {boolean}        autofocus Enforces autofocus tag on input.
   * @property {boolean}        autocomplete Enforces autocomplete tag on input.
   * @property {number | null}  maxLength Max length restriction for input.
   * @property {string}         placeholder Input's placeholder attribute.
   * @property {number | string | null} maxHeight EmailsInput max height restriction. If passed as number will treat value as px.
   * @property {number | string | null} minHeight EmailsInput min height restriction. If passed as number will treat value as px.
   */

  /**
   * An EmailsInput Item object
   * @typedef EmailsInputItem
   * @type {object}
   * @property {string}         value Item's email value.
   * @property {boolean}        valid Email validity flag.
   * @property {string | null}  renderedId Internal rendered id.
   */

  /** @type {EmailsInputOptions} EmailsInput options defaults */
  var DEFAULT_OPTIONS = {
    pattern: /^[\w.%+-/!#$%&'*=?^_`{|}~]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    embedCSS: true,
    cssNamespace: null,
    autofocus: false,
    autocomplete: false,
    maxLength: null,
    placeholder: 'add email by typing here',
    maxHeight: null,
    minHeight: null
  };

  var DISPATCH_EVENT_NAME = 'emailsinputchange';

  /** @type {number} Global EmailsInput id base reference. */
  var id = 1;

  var ASSET_SVG_CLOSE_ICON =
    '<svg width="100%" height="100%" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M8 0.8L7.2 0L4 3.2L0.8 0L0 0.8L3.2 4L0 7.2L0.8 8L4 4.8L7.2 8L8 7.2L4.8 4L8 0.8Z" fill="currentColor"/>' +
    '</svg>';
  var STYLESHEET_TEMPLATE =
    ".{{prefix}}emails-input { min-height: 96px; max-height: 96px; background: #FFF; border: 1px solid #C3C2CF; border-radius: 4px; color: #050038; font-size: 14px; font-family: 'Open Sans', sans-serif; line-height: 1.7143; overflow: auto; } .{{prefix}}emails-input__container { display: flex; flex-wrap: wrap; padding: 3px 2px; } .{{prefix}}emails-input__input { flex: 1 0 auto; padding: 0; margin: 4px; background: transparent; border: 0; color: inherit; font-size: inherit; line-height: inherit; outline: 0; } .{{prefix}}emails-input__input::placeholder { color: #C3C2CF; } .{{prefix}}emails-input__item { position: relative; margin: 4px; padding: 0 0.57143em 0 0.7142em; white-space: nowrap; background: rgba(102, 153, 255, 0.2); border-radius: 100px; } .{{prefix}}emails-input__item--invalid { padding: 0; background: transparent; border-radius: 0; } .{{prefix}}emails-input__item--invalid::before { content: ''; position: absolute; left: 0; right: 0; bottom: 0; border-bottom: 1px dashed #D92929; } .{{prefix}}emails-input__item-value { display: inline-block; } .{{prefix}}emails-input__remove { position: relative; width: 0.57143em; margin: 0; margin-left: 0.57143em; padding: 0; background: transparent; border: none; font: inherit; text-transform: none; cursor: pointer; } .{{prefix}}emails-input__remove::before { content: ''; position: absolute; top: 0; left: -0.57143em; right: -0.57143em; bottom: 0; }";

  return function EmailsInput(
    /** @type{HTMLElement} */ element,
    /** @type{EmailsInputOptions} */ opts
  ) {

    /**
     * Injects namespaced stylesheet in runtime
     * @param {string | null} cssNamespace
     * @returns void
     */
    function injectStyleSheet(cssNamespace) {
      var styleSheetId = 'emails-input__styles' + (cssNamespace ? '--' + cssNamespace : '');

      if (!document.getElementById(styleSheetId)) {
        var prefixedStyleSheet = STYLESHEET_TEMPLATE.replace(/{{prefix}}/g, cssNamespace ? cssNamespace + '-' : '');
        var stylesNode = document.createElement('style');
        stylesNode.id = styleSheetId;
        stylesNode.innerHTML = prefixedStyleSheet;
        document.head.append(stylesNode);
      }
    }

    /**
     * Compose CSS class name with namespace from options
     * @param {string} className
     * @returns {string} Prefixed className
     */
    function setNsClassName(className) {
      return options.cssNamespace ? options.cssNamespace + '-' + className : className;
    }

    /**
     * Validate email against a pattern
     * @param {string} email
     * @returns {boolean} Email validity
     */
    function validateEmail(email) {
      if (!email) return false;
      if (!options.pattern) return true;
      return options.pattern.test(email);
    }

    /**
     * Input's Keypress event handler. Triggers value addition when ',' or 'Enter' key pressed
     * @param {KeyboardEvent} evt KeyboardEvent
     * @returns void
     */
    function handleKeypress(evt) {
      if (evt.key === ',' || evt.key === 'Enter') {
        evt.preventDefault();
        addItems(inputElement.value);
        inputElement.value = '';
      }
    }

    /**
     * Input's blur event handler. Triggers value addition when input loses focus
     * @param {FocusEvent} evt FocusEvent
     * @returns void
     */
    function handleBlur(evt) {
      if (inputElement.value) {
        addItems(inputElement.value);
        inputElement.value = '';
      }
    }

    /**
     * Input's paste event handler. Triggers value addition when value pasted into input
     * @param {ClipboardEvent} evt ClipboardEvent
     * @returns void
     */
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


    /**
     * Creates CustomEvent depending on browser
     * @param {EmailsInputItem[]} items CustomEvent payload (Event.details property)
     * @returns CustomEvent
     */
    function createEvent(items) {
      if (typeof window.CustomEvent === 'function') {
        return new CustomEvent(DISPATCH_EVENT_NAME, { detail: items });
      } else if (document.createEvent) {
        // IE fallback
        var event = document.createEvent('CustomEvent');
        event.initCustomEvent(DISPATCH_EVENT_NAME, true, true, items);
        return event;
      }
    }

    /**
     * Invokes all subscribed callbacks
     * @returns void
     */
    function notifyOnChanges() {
      var updatedItems = items.map(function(item) {
        return Object.assign({}, item);
      });

      // Dispatch custom event
      var changeEvent = createEvent(updatedItems);
      element.dispatchEvent(changeEvent);

      // Invoke all subscribed callbacks
      subscriptions.forEach(function(cb) {
        cb(updatedItems);
      })
    }

    /**
     * EmailsInput items renderer function.
     * @returns void
     */
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

    /**
     * Removes item from collection and HTML markup
     * @param {string} itemId Item's renderedId
     * @returns void
     */
    function removeItem(itemId) {
      if (!itemId) return;

      var itemElement = container.querySelector('[data-item-id="' + itemId + '"]');
      container.removeChild(itemElement);

      items = items.filter(function (item) {
        return item.renderedId !== itemId;
      });

      notifyOnChanges();
    }

    /**
     * Handles new values addition.
     * @param {string | string[]} newValues Value(s) from input (event listeners/Public API)
     * @returns void
     */
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
        notifyOnChanges();
        inputElement.scrollIntoView({ behavior: 'smooth' });
      }
    }

    /**
     * Setup EmailsInput input element and its event listeners
     * @param {Node} parentNode Input's parent node
     * @param {EmailsInputOptions} opts Emails Input options
     * @returns {Node} Input HTML element reference
     */
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

    /** @type {number} This EmailsInput instance id. */
    var instanceId = 'ei' + id++;
    /** @type {number} This EmailsInput item id base reference. */
    var itemId = 0;

    /** @type {EmailsInputOptions} EmailsInput instance options */
    var options;

    /** @type {HTMLDivElement} Internal EmailsInput wrapper element. */
    var container;
    /** @type {HTMLInputElement} Internal EmailsInput input element. */
    var inputElement;
    /** @type {EmailsInputItem[]} Collection of EmailsInput added emails. */
    var items = [];
    /** @type {Function[]} Subscribed callbacks array. */
    var subscriptions = []

    options = Object.assign({}, DEFAULT_OPTIONS, opts);

    if (options.embedCSS !== false) {
      injectStyleSheet(options.cssNamespace);
    }

    if (opts.pattern !== undefined) {
      options.pattern = new RegExp(opts.pattern);
    }

    // Setup parent element
    element.classList.add(setNsClassName('emails-input'));

    if (options.minHeight) {
      if (typeof options.minHeight === 'number') options.minHeight += 'px';
      element.style.minHeight = options.minHeight;
    }

    if (options.maxHeight) {
      if (typeof options.maxHeight === 'number') options.maxHeight += 'px';
      element.style.maxHeight = options.maxHeight;
    }

    // Setup element's event listener, that will force input focus on click inside of EmailsInput
    element.addEventListener('click', function (evt) {
      // Ensure that click target is not a rendered item
      if (evt.target === element || evt.target === container) {
        inputElement.focus();
      }
    }, false);

    // Create and setup child container element
    container = document.createElement('div');
    container.classList.add(setNsClassName('emails-input__container'));
    element.appendChild(container);

    inputElement = createInput(container, options);

    return {
      /** @type {HTMLElement} EmailsInput container DOM node. */
      container: element,

      /**
       * Retrieve collected emails along with its validity and renderedId
       * @returns {EmailsInputItem[]} EmailsInput items
       */
      getValues: function getValues() {
        return items.map(function (item) {
          return Object.assign({}, item);
        });
      },

      /**
       * Add one or more emails
       * @param {string | string[]} email New email values.
       * @returns {EmailsInputItem[]} EmailsInput items
       */
      add: function add(email) {
        addItems(email);
        return this.getValues();
      },

      /**
       * Reset EmailsInput state. Removes all emails.
       * @returns void
       */
      reset: function reset() {
        container.querySelectorAll('[data-item-id]').forEach(function (itemNode) {
          container.removeChild(itemNode);
        });
        items = [];
        notifyOnChanges();
      },

      /**
       * Subscribe to chanes by providing callback
       * @returns void
       */
      subscribe: function subscribe(cb) {
        subscriptions.push(cb);
      }
    };
  };
})();
