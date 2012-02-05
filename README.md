Sticky
======

A super simple notification system for jQuery, similar to Growl notifications.

Project page on Github - https://github.com/makuchaku/sticky2


Usage
-----

Include the files in your document's header:

```html
<script type="text/javascript" src="/path/to/your/jquery.js"></script>
<script type="text/javascript" src="sticky.js"></script>
<link rel="stylesheet" type="text/css" href="sticky.css" />
```

Basic Usage

```javascript
$.sticky('This is a Sticky Note!');
```

Advanced Options

```javascript
$.sticky(
  'This is a very special Sticky Note!', 
  {
    speed : 1500, 
    position : 'top-center',
    duplicates : false,
    autoclose : false
  }, 
  function(args){ /*onShow Callback*/ }
);
```

Authors
-------

**Original Author: Daniel Raftery**

+ http://thrivingkings.com
+ http://twitter.com/thrivekings
+ http://github.com/thrivekings

**Branched Author: makuchaku**

+ http://makuchaku.in
+ http://twitter.com/makuchaku
+ http://github.com/makuchaku

Browser compatibility
---------------------

+ Chrome 8.0+
+ Firefox 3.0+
+ Safari 4.0+
+ Internet Explorer 7.0+

License
---------------------

This work is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).