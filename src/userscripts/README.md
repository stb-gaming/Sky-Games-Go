## Example Userscript

```
// ==UserScript==
// @name         STBG User Script Template
// @namespace    https://stb-gaming.github.io
// @version      0.0.1
// @description  A template for creating user scripts
// @author       You
// @run-at       document-start
// @match        https://denki.co.uk/sky/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=denki.co.uk
// ==/UserScript==

(function (userscript) {
	const init = global => {
		const context = {
			...global,
			get global() { return global; },
			get unsafeWindow() { return global; },
			get uWindow() { return global; },
			exports: {}
		};
		userscript.call(context, context);
		return context.exports;
	};

	if (typeof module === 'undefined') {
		// eslint-disable-next-line no-undef
		const uWindow = typeof unsafeWindow === 'undefined' ? window : unsafeWindow,
			exports = init(uWindow);

		for (const key in exports)
			if (!uWindow.hasOwnProperty(key))
				uWindow[key] = exports[key];
	} else
		module.exports.init = init;
})(function ({ exports }) {
	exports.test = function () {
		console.log("works");
	};
});

```


## How to setup

```js
// ==UserScript==
// @name         STBG User Script Template
// @namespace    https://stb-gaming.github.io
// @version      0.0.1
// @description  A template for creating user scripts
// @author       You
// @run-at       document-start
// @match        https://denki.co.uk/sky/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=denki.co.uk
// ==/UserScript==

(boilerplate)(function(context) {

});
```
### Boilerplate
this sets up the context and also detects if we should give the userscript to react or run it straght away.
```js
function (userscript) {
	const init = global => {
		const context = {
			...global,
			get global() { return global; },
			get unsafeWindow() { return global; },
			get uWindow() { return global; },
			exports: {}
		};
		userscript.call(context, context);
		return context.exports;
	};

	if (typeof module === 'undefined') {
		// eslint-disable-next-line no-undef
		const uWindow = typeof unsafeWindow === 'undefined' ? window : unsafeWindow,
			exports = init(uWindow);

		for (const key in exports)
			if (!uWindow.hasOwnProperty(key))
				uWindow[key] = exports[key];
	} else
		module.exports.init = init;
}
```

### Context
list of context variables include

* global - window
* window - window
* unsafeWindow - window
* uWindow - window
* exports - export objects to be used by other things

```js
exports.sayHi = function() {
	console.log("hello");
}
```

then anouter script can do this
```js
sayHi();
```
