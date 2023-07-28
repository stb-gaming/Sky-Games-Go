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
// ==/UserScript==

import SkyRemote from "./SkyRemote.user";

// eslint-disable-next-line no-undef
const uWindow = typeof unsafeWindow === 'undefined' ? window : unsafeWindow;

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
		if (lastPressed[index] !== gamepad.buttons[index].pressed) {
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
uWindow.addEventListener("gamepadconnected", event => {
	mainLoop();
});

uWindow.addEventListener("gamepaddisconnected", event => {
	uWindow.cancelAnimationFrame(start);
});
