Emails Input standalone component
======================
#### [Miro](https://miro.com) Frontend test assesment

Emails Input is a reusable component created to provide an easy way to collect emails.


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


### Usage
