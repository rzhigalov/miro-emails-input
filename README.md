Emails Input standalone component
======================
#### [Miro](https://miro.com) Frontend test assesment

Emails Input is a reusable component created to provide an easy way to collect emails.

[Simple Demo page](https://rzhigalov.github.io/miro-emails-input/)

### Minimal Setup

1. Download minified script version:  
   [emails-input.min.js](https://github.com/rzhigalov/miro-emails-input/blob/master/emails-input.min.js)
2. Add script tag to your page  
   ```html
   <script src="emails-input.min.js" defer type="text/javascript"></script>
   ```
3. Add container element in your markup  
   ```html
   <div id="emails-input"></div>
   ```
4. Add initializing function  
    ```javascript
    document.addEventListener('DOMContentLoaded', function() {
      var options = {
        // Configuration is optional and described in the section below
      };
      var inputContainerNode = document.querySelector('#emails-input');
      var emailsInput = EmailsInput(inputContainerNode, options);
    });
    ```
5. Enjoy using the component


### Component behaviour
EmailsInput component is initialized by `EmailsInput(elementNode, options)` call.  
* It will create all internal markup on initialization.  
* Stylesheet is prefixed and inserted into the document upon EmailsInput initialization (once per prefix). If this is not a desired behaviour for you, see `embedCSS` option.
* Invalid emails are accepted, but will have different styling and `valid:false` flag in returned collection.
* Email blocks are created by pressing Enter, entering coma or by loosing focus on the input field.  
* Pasted emails are converted into blocks immediately. If input had any value it will be prepended to input value.
* Email blocks may be removed by clicking the cross icon or by calling public API methods (see `replaceAll` or `reset`)
* It is possible to create multiple EmailsInput on one page – they are not interfering with each other and will have unique internal ids.


### Public methods

EmailsInput function returns component instance. It provides following public methods and properties:  
* `container` – reference to parent HTML element passed as the first parameter
* `getValues()` – returns collection of emails with following signature:
   ```js
    {
      value: string,      // Email value.
      valid: boolean,     // Email validity flag based on options.pattern
      renderedId: string  // Internal rendered id. 
                          // Can be used to query element as `[data-item-id]="renderedId"`
    }
   ```
* `add(emails)` – Add one or more emails. `emails` can be passed as a string with comma separated values or array of strings.
* `replaceAll(emails)` – Replace all entered emails with new ones. `emails` can be passed as a string with comma separated values or array of strings.
* `reset()` – Reset EmailsInput state. Removes all emails.
* `subscribe(cb)` – Register callback function to be triggered on `EmailsInput.items` change. Will invoke callback as `cb(items)` (see `getValues()` for items signature)

Container element will receive Custom Event `emailsinputchange` so you can subscribe to value changes using [EventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener). Corresponding values will be passed in `Event.detail` property.


### Configuration
EmailsInput can be configured with `options` object passed as a second argument to initializer.  
##### List of configuration options (everything is optional):
* `pattern` _string_ or _RegExp_ – Pattern against which email validity is tested.  
  Defaults to relaxed pattern, that allows special symbols in _name_ part of emails.  
  **Default**: ```/^[\w.%+-/!#$%&'*=?^_`{|}~]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/```  
  Can be set to validate against domains (e.g. `/.*@miro.com$/`)
* `embedCSS` _boolean_ – Enables runtime stylesheet embedding.  
  Set to `false` if you prefer handling your stylesheets manually. In that case you will need to link [emails-input.min.css stylesheet](https://github.com/rzhigalov/miro-emails-input/blob/master/emails-input.min.css) or provide a custom one.  
  **Default**: `true`
* `cssNamespace` _string_ – CSS classes prefix. Use to avoid styles collision. **Disabled by default**
* `autofocus` _boolean_ – Enforces [autofocus](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-autofocus) attribute on input. Use with caution. **Disabled by default**
* `autocomplete` _boolean_ – Enables autocomplete on input. **Disabled by default**
* `maxLength` _number_ – Sets max length restriction on input. **Disabled by default**
* `placeholder` _string_ – Input's placeholder attribute.  
  **Default**: `add email by typing here`
* `maxHeight` _number_ or _string_ – EmailsInput max height restriction. If passed as number will treat value as px. Set to _'auto'_ if you want input to grow as values add.  
  **Default**: `96px` via stylesheet
* `minHeight` _number_ or _string_ – EmailsInput min height restriction. If passed as number will treat value as px. Set to _'auto'_ if you want input to collapse into 1 line.  
  **Default**: `96px` via stylesheet 


### FAQ
1. What is browser support for this component?  
   Last 2 versions of every major browser is supported. And **IE 11**.  
   And _probably_ IE 10, but I have no chance to test it  🤷🏻‍♂️

2. Will multiple instances of EmailsInput conflict with each other?  
   No. Every instance is isolated and provides globally unique internal ids.

3. I want my EmailInputs to look differently on one page. Do I need to write complex CSS overrides?  
   No, you don't have to. You can use `cssNamespace` to prevent collision and disable `embedCSS` to use your own stylesheet – feel free to use [emails-input.css stylesheet](https://github.com/rzhigalov/miro-emails-input/blob/master/emails-input.css) as a reference!

4. Why there are no tests?  
   Because I am still thinking on how to test _not only_ the public API, but perform tests on internals granulary withouth breaking existing closure construct. If for some reason you need this component for production, please [create an issue](https://github.com/rzhigalov/miro-emails-input/issues) so I know you need tests.

5. How can I receive changes without checking `getValues()`?  
   There are two ways to achieve that:  
   1. Setup EventListener on EmailsInput node  
      ```html
      <div id="emails-input"></div>
      ...
      <script>
        var inputContainerNode = document.querySelector('#emails-input');
        inputContainerNode.addEventListener('emailsinputevent', function(inputEvt) {
          const emails = inputEvt.details;
          // Process received emails (objects)
        }, false);
      </script>
      ```
   2. _Subscribe_ to value changes by using callback(s). Every callback will be invoked on every EmailsInput value changes.  
      ```js
      var emailsInput = EmailsInput(inputContainerNode, options);
      emailsInput.subscribe(function(emailItems) {
        // Process received emails (objects)
      });
      ```

6. Can I use npm to install this package?  
   No, sorry. This component was created for demo purposes.

7. Can I use it with TypeScript?  
   Well, why not? This component lacks `d.ts` files, but annotated with JSDoc, so we can generate missing files in a minute!

8. Do I have to use `defer` attribute for script?  
   No, but it is better for your page's load.
