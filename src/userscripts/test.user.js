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

const init = function () {
	'use strict';

	// eslint-disable-next-line no-undef
	const uWindow = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;

	console.log("I have access to the window element", uWindow);

};



if (typeof module == "undefined") {
	init();
	init = undefined;
} else {
	module.exports.init = init;
}
