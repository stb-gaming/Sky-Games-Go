// ==UserScript==
// @name         STBG Controller Support Script
// @namespace    https://stb-gaming.github.io
// @version      0.3.0
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

const
	buttonMapping = {
		0: 'select',
		1: 'red',
		2: 'blue',
		3: 'yellow',
		4: 'channel-up',
		5: 'channel-down',
		8: 'green',
		9: 'backup',
		11: 'help',
		12: 'up',
		13: 'down',
		14: 'left',
		15: 'right'
	};

let
	start,
	gamepad,
	lastPressed = []; // track button states

function checkGamepad() {
	let problems = [];

	function addProblem(problem) {
		problems.push(problem);
		console.warn(problem);
	}

	if (typeof gamepad === 'undefined') {
		addProblem("No gamepad");
		return;
	}

	Object.keys(gamepad).forEach(key => {
		console.debug(`Checking ${key} => `, gamepad[key]);

		if (typeof gamepad[key] === 'undefined' ||
			(
				Array.isArray(gamepad[key])
				&& (
					!gamepad[key].length || !!gamepad[key].filter(a => typeof a === 'undefined').length
				)
			)
		) {
			addProblem(`There is a problem with the gamepad's ${key} in your browser.`);
		}
	});

	if (Object.keys(buttonMapping).map(key => typeof gamepad.buttons[key] !== "undefined").includes(false)) {
		addProblem(`Not all of your gamepad buttons are registered. This could be due to your gamepad not being standard layout or a browser issue.`);
	};
	return problems;
}

function mainLoop() { // todo: add analogue stick support (axes should map to arrow buttons)
	[gamepad] = navigator.getGamepads();

	let problems = checkGamepad();

	if (problems.length) {
		alert("There are problems with the gamepad setup:\n" + problems.join("\n"));
		cleanupControllerBinds();
		return;
	}

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
	start = uWindow.requestAnimationFrame(mainLoop);
}

const onConnect = (event) => {
	start = uWindow.requestAnimationFrame(mainLoop);
};

const onDisconnect = (event) => {
	if (typeof start !== "undefined")
		uWindow.cancelAnimationFrame(start);
};

function initControllerBinds() {
	uWindow.addEventListener("gamepadconnected", onConnect);
	uWindow.addEventListener("gamepaddisconnected", onDisconnect);
	console.debug("Sky Remote bound to gamepad");
}

function cleanupControllerBinds() {
	uWindow.removeEventListener("gamepadconnected", onConnect);
	uWindow.removeEventListener("gamepaddisconnected", onDisconnect);
	uWindow.cancelAnimationFrame(start);
}

// eslint-disable-next-line no-undef
if (typeof IS_STANDALONE !== 'undefined' && IS_STANDALONE) {
	initControllerBinds();
}

export { initControllerBinds, cleanupControllerBinds };
