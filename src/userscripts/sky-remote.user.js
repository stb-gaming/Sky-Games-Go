// ==UserScript==
// @name         STBG Sky Remote API
// @namespace    https://stb-gaming.github.io
// @version      1.3.7
// @description  The ultimate Sky Remote API (hopefully) containing everything to simulate a sky remote in your browser
// @author       Tumble
// @run-at       document-start
// @match        https://denki.co.uk/sky/*
// @match        https://stb-gaming.github.io/*
// @match        https://beehive-bedlam.com/*
// @match        http://localhost:4000/*
// @match        *://*
// @icon         https://stb-gaming.github.io/assets/img/stb-logo.webp
// @require      https://github.com/STB-Gaming/Sky-Games-X/raw/master/src/userscripts/check-userscript.js
// @require      https://github.com/STB-Gaming/Sky-Games-X/raw/master/src/userscripts/beehive-bedlam.user.js
// ==/UserScript==



let init = function () {
	'use strict';

	// eslint-disable-next-line no-undef
	const uWindow = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;

	const VERSION = [1, 3, 7];
	const { IS_THIS_USERSCRIPT, IS_THIS_USERSCRIPT_DEV, IS_USERSCRIPT, IS_COMMONJS, GET_STARTED } = uWindow.checkUserscript("STBG Sky Remote API", VERSION, "SkyRemote");
	if (!GET_STARTED) return;


	function SkyRemote(bindings) {
		if (!new.target) return console.error("Use 'new' with this function");
		if (!bindings || !bindings.length) {
			throw "[SKY REMOTE] No bindings were provided";
		}

		this.bindings = bindings;

		// Legacy Support
		// TODO: use the bindings object instead
		this.remote = this.bindings.reduce((controls, { button, keyCodes }) => {
			controls[button] = keyCodes[0];
			return controls;
		}, {});
		this.heldButtons = [];

	}



	SkyRemote.buttons = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'sky', 'tv-guide', 'box-office', 'services', 'interactive', 'i', 'up', 'left', 'down', 'right', 'select', 'channel-up', 'channel-down', 'backup', 'help', 'red', 'green', 'yellow', 'blue'];
	SkyRemote.createBindings = function () {
		let bindings = [];
		let b = 0;

		console.log("[SKY REMOTE] First button:", SkyRemote.buttons[b]);

		document.addEventListener("keyup", e => {
			let button = SkyRemote.buttons[b];
			let binding = bindings.find(b => b.button == button);
			if (!binding) {
				console.log("[SKY REMOTE] Setting up new button");
				binding = {
					button,
					keys: [],
					keyCodes: [],
					function: this.toLegacyFunction(button)
				};
				bindings.push(binding);
			}
			if (e.key == "End") {
				b++;
				b %= SkyRemote.buttons.length;
				console.log("[SKY REMOTE] Progress:", bindings);
				console.log("[SKY REMOTE] Next Button:", SkyRemote.buttons[b]);

			} else {
				console.log("[SKY REMOTE] Adding new binding for " + button + ":", e.key, e.keyCode);
				binding.keys.push(e.key);
				binding.keyCodes.push(e.keyCode);
			}
		});
	};

	SkyRemote.triggerEvent = function (event, key, element = document) {
		if (!event) {
			console.error("[SKY REMOTE] No event was provided");
			return;
		}
		if (!key) {
			console.error("[SKY REMOTE] No key was provided");
			return;
		}
		element.dispatchEvent(new KeyboardEvent(event, {
			keyCode: key,
			bubbles: true,
			cancelable: true,
			composed: true
		}));
	};

	SkyRemote.prototype.version = VERSION;

	SkyRemote.prototype.printVersionInfo = function () {
		console.log(`[STB Gaming Sky Remote API]
Created by: Tumble
Version: ${this.version.join(".")} (${IS_THIS_USERSCRIPT_DEV ? "Development" : IS_THIS_USERSCRIPT ? "Userscript" : IS_USERSCRIPT ? "Userscript @require" : IS_COMMONJS ? "CommonsJS/Nodejs" : "Website <script>"})`);
	};

	SkyRemote.prototype.listButtons = function () {
		return SkyRemote.buttons;
	};


	SkyRemote.prototype.getBinding = function (btn) {
		if (!btn) {
			console.error("[SKY REMOTE] No button was provided");
			return;
		}
		return this.bindings.find(b => b.button == btn);
	};


	SkyRemote.prototype.holdButton = function (btn, element = document) {
		if (!btn) {
			console.error("[SKY REMOTE] No button was provided");
			return;
		}
		if (this.listButtons().includes(btn)) {
			let keyCode = this.remote[btn];
			this.heldButtons[keyCode] = true;
			SkyRemote.triggerEvent("keydown", keyCode, element);
		}
	};

	SkyRemote.prototype.onHoldButton = function (btn, func, element = document) {
		if (!btn) {
			console.error("[SKY REMOTE] No button was provided");
			return;
		}
		if (!func) {
			console.error("[SKY REMOTE] No function was provided");
			return;
		}
		let binding = this.getBinding(btn);
		element.addEventListener("keydown", event => {
			if (binding.keys.includes(event.key) || binding.keyCodes.includes(event.keyCode)) {
				func.call(this, event);
			}
		});
	};

	SkyRemote.prototype.releaseButton = function (btn, element = document) {
		if (!btn) {
			console.error("[SKY REMOTE] No button was provided");
			return;
		}
		let keyCode = this.remote[btn];
		if (this.heldButtons[keyCode]) {
			SkyRemote.triggerEvent("keyup", keyCode, element);
			this.heldButtons[keyCode] = false;
		}
	};


	SkyRemote.prototype.onReleaseButton = function (btn, func, element = document) {
		if (!btn) {
			console.error("[SKY REMOTE] No button was provided");
			return;
		}
		if (!func) {
			console.error("[SKY REMOTE] No function was provided");
			return;
		}
		let binding = this.getBinding(btn);
		element.addEventListener("keyup", event => {
			if (binding.keys.includes(event.key) || binding.keyCodes.includes(event.keyCode)) {
				func.call(this, event);
			}
		});
	};

	SkyRemote.prototype.pressButton = function (btn, element = document) {
		if (!btn) {
			console.error("[SKY REMOTE] No button was provided");
			return;
		}
		this.holdButton(btn, element);
		setTimeout(() => this.releaseButton(btn, element), 500);
	};

	SkyRemote.prototype.onPressButton = function (btn, func, element = document) {
		if (!btn) {
			console.error("[SKY REMOTE] No button was provided");
			return;
		}
		if (!func) {
			console.error("[SKY REMOTE] No function was provided");
			return;
		}
		let binding = this.getBinding(btn);

		let handler = e => {
			if (binding.keys.includes(e.key) || binding.keyCodes.includes(e.keyCode)) {
				func.call(this, e);
			}
		};

		element.addEventListener("keyup", e => {
			if (e.key == e.code) { handler(e); }
		});

		element.addEventListener("keypress", handler);
	};


	SkyRemote.prototype.createSkyRemote = function (funcs) {
		console.warn(`[SKY REMOTE] SkyRemote.createSkyRemote will be deprecated for;
- SkyRemote.onHoldButton(btn,function(event){

  })
- SkyRemote.onPressButton(btn,function(event){

  })
- SkyRemote.onReleaseButton(btn,function(event){

  })
Please contact the website owner of this change if you can.`);
		if (!funcs) {
			console.error("[SKY REMOTE] No functions were provided.");
			return;
		}
		let controls = this.bindings;

		for (const control of controls) {
			let func = this.toLegacyFunction(control.button);
			if (func && funcs[func]) {
				this.onPressButton(control.button, funcs[func]);
			}

		}
	};

	/**
	 * Creates a string for the name of the legacy button press event functions (e.g. pressRed, pressUp, etc.)
	 * @param {string} btn
	 * @returns
	 */
	SkyRemote.prototype.toLegacyFunction = function (btn) {
		if (!btn) {
			console.error("[SKY REMOTE] No button was provided");
			return;
		}
		return "press" + btn.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join("");
	};

	uWindow.SkyRemote = new SkyRemote([
		{
			"button": "0",
			"keys": [
				"0"
			],
			"keyCodes": [
				48
			]
		},
		{
			"button": "1",
			"keys": [
				"1"
			],
			"keyCodes": [
				49
			]
		},
		{
			"button": "2",
			"keys": [
				"2"
			],
			"keyCodes": [
				50
			]
		},
		{
			"button": "3",
			"keys": [
				"3"
			],
			"keyCodes": [
				51
			],
			"function": "press3"
		},
		{
			"button": "4",
			"keys": [
				"4"
			],
			"keyCodes": [
				52
			],
			"function": "press4"
		},
		{
			"button": "5",
			"keys": [
				"5"
			],
			"keyCodes": [
				53
			]
		},
		{
			"button": "6",
			"keys": [
				"6"
			],
			"keyCodes": [
				54
			]
		},
		{
			"button": "7",
			"keys": [
				"7"
			],
			"keyCodes": [
				55
			],
			"function": "press7"
		},
		{
			"button": "8",
			"keys": [
				"8"
			],
			"keyCodes": [
				56
			]
		},
		{
			"button": "9",
			"keys": [
				"9"
			],
			"keyCodes": [
				57
			]
		},
		{
			"button": "sky",
			"keys": [
				"Escape"
			],
			"keyCodes": [
				27
			]
		},
		{
			"button": "tv-guide",
			"keys": [
				"a"
			],
			"keyCodes": [
				65
			]
		},
		{
			"button": "box-office",
			"keys": [
				"s"
			],
			"keyCodes": [
				83
			],
		},
		{
			"button": "services",
			"keys": [
				"d"
			],
			"keyCodes": [
				68
			]
		},
		{
			"button": "interactive",
			"keys": [
				"f"
			],
			"keyCodes": [
				70
			]
		},
		{
			"button": "i",
			"keys": [
				"g"
			],
			"keyCodes": [
				71
			],
			"function": "pressI"
		},
		{
			"button": "up",
			"keys": [
				"ArrowUp",
				"i"
			],
			"keyCodes": [
				38,
				73
			]
		},
		{
			"button": "left",
			"keys": [
				"ArrowLeft",
				"j"
			],
			"keyCodes": [
				37,
				74
			]
		},
		{
			"button": "down",
			"keys": [
				"ArrowDown",
				"k"
			],
			"keyCodes": [
				40,
				75
			],
		},
		{
			"button": "right",
			"keys": [
				"ArrowRight",
				"l"
			],
			"keyCodes": [
				39,
				76
			],
		},
		{
			"button": "select",
			"keys": [
				" ",
				"Enter"
			],
			"keyCodes": [
				32,
				13
			],
		},
		{
			"button": "channel-up",
			"keys": [
				"PageUp"
			],
			"keyCodes": [
				33
			],
		},
		{
			"button": "channel-down",
			"keys": [
				"PageDown"
			],
			"keyCodes": [
				34
			],
		},
		{
			"button": "backup",
			"keys": [
				"Backspace"
			],
			"keyCodes": [
				8
			]
		},
		{
			"button": "help",
			"keys": [
				"t"
			],
			"keyCodes": [
				84
			]
		},
		{
			"button": "red",
			"keys": [
				"q"
			],
			"keyCodes": [
				81
			]
		},
		{
			"button": "green",
			"keys": [
				"w"
			],
			"keyCodes": [
				87
			]
		},
		{
			"button": "yellow",
			"keys": [
				"e"
			],
			"keyCodes": [
				69
			]
		},
		{
			"button": "blue",
			"keys": [
				"r"
			],
			"keyCodes": [
				82
			]
		}
	]);
};


if (typeof module == "undefined") {
	init();
	init = undefined;
} else {
	module.exports.init = init;
}
