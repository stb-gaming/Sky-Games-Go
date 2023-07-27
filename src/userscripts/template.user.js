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
			get window() { return global; },
			get global() { return global; },
			get unsafeWindow() { return global; },
			get uWindow() { return global; },
			exports: {}
		};
		userscript.call(context, context);
		return context.exports;
	};

	if (typeof module === 'undefined' || typeof module.exports === 'undefined') {
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
