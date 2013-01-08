From previous version of README

## Supported Methods

<pre>
  - 'close': Close the browser
  - 'quit': Quit the session
  - 'eval': Eval JS and return the value (takes a code string)
  - 'execute': Eval JS (takes a code string)
  - 'executeAsync': Execute JS in an async way (takes a code string)
  - 'get': Navigate the browser to the provided url (takes a URL)
  - 'setWaitTimeout': Set the implicit wait timeout in milliseonds (takes wait time in ms)
  - 'element': Access an element in the page (takes 'using' and 'value' so ex: 'id', 'idofelement')
  - 'moveTo': Move an element on the page (takes element, xoffset and yoffset'
  - 'scroll': Scroll on an element (takes element, xoffset, yoffset)
  - 'buttonDown': Click and hold the left mouse button down, at the coords of the last moveTo
  - 'buttonUp': Release the left mouse button
  - 'click': Click a mouse button, at the coords of the last moveTo (takes a button param for {LEFT = 0, MIDDLE = 1 , RIGHT = 2})
  - 'doubleClick': Double click a mouse button, same coords as click
  - 'type': Type! (takes an element, a key character, or an array of char keys)
  - 'active': Get the element on the page currently with focus
  - 'keyToggle': Press a keyboard key (takes an element and a key character'
  - 'setCookie': Sets a <a href="http://code.google.com/p/selenium/wiki/JsonWireProtocol#Cookie_JSON_Object">cookie</a>
</pre>
