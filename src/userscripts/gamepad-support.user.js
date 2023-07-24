// ==UserScript==
// @name         STBG Controller Support Script
// @namespace    https://stb-gaming.github.io
// @version      0.2.6
// @description  A script that uses the JS Gamepad API to add controller support to Denki's online Sky Games
// @author       cobaltgit
// @run-at       document-start
// @match        https://denki.co.uk/sky/*
// @match        https://beehive-bedlam.com/*
// @match        https://stb-gaming.github.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=denki.co.uk
// @require      https://github.com/STB-Gaming/userscripts/raw/master/sky-remote.user.js
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
})(function ({ SkyRemote, window }) {

	const buttonMapping = {
		12: "up",
		13: "down",
		14: "left",
		15: "right",
		9: "backup",
		0: "select",
		1: "red",
		2: "blue",
		3: "yellow",
		8: "green",
		11: "help"
	};

	let
		start,
		gamepad,
		lastPressed = []; // track button states

	function mainLoop() { // todo: add analogue stick support (axes should map to arrow buttons)
		let gamepads = navigator.getGamepads();
		if (!gamepads) return;
		gamepad = gamepads[0];

		for (const index of Object.keys(buttonMapping)) {
			if (lastPressed[index] != gamepad.buttons[index].pressed) {
				if (gamepad.buttons[index].pressed) {
					SkyRemote.holdButton(buttonMapping[index]);
				} else {
					SkyRemote.releaseButton(buttonMapping[index]);
				}
				lastPressed[index] = gamepad.buttons[index].pressed;
			}
		}

		start = window.requestAnimationFrame(mainLoop);
	}
	window.addEventListener("gamepadconnected", event => {
		mainLoop();
	});

	window.addEventListener("gamepaddisconnected", event => {
		window.cancelAnimationFrame(start);
	});
});
