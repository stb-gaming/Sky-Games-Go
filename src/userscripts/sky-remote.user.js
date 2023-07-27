// ==UserScript==
// @name         STBG Sky Remote API
// @namespace    https://stb-gaming.github.io
// @version      1.3.8
// @description  The ultimate Sky Remote API (hopefully) containing everything to simulate a sky remote in your browser
// @author       Tumble
// @run-at       document-start
// @match        https://denki.co.uk/sky/*
// @match        https://stb-gaming.github.io/*
// @match        https://beehive-bedlam.com/*
// @match        http://localhost:4000/*
// @match        *://*
// @icon         https://stb-gaming.github.io/assets/img/stb-logo.webp
// @require      https://github.com/STB-Gaming/userscripts/raw/master/beehive-bedlam.user.js
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

	if (typeof module === 'undefined' || typeof module.exports === 'undefined') {
		// eslint-disable-next-line no-undef
		const uWindow = typeof unsafeWindow === 'undefined' ? window : unsafeWindow,
			exports = init(uWindow);

		for (const key in exports)
			if (!uWindow.hasOwnProperty(key))
				uWindow[key] = exports[key];
	} else
		module.exports.init = init;
})(function ({ checkUserscript, exports }) {
	const VERSION = [1, 3, 8];

	const { IS_THIS_USERSCRIPT, IS_THIS_USERSCRIPT_DEV, IS_USERSCRIPT, IS_COMMONJS, GET_STARTED } = checkUserscript("STBG Sky Remote API", VERSION, "SkyRemote");
	if (!GET_STARTED) return;


	/**
 * Initializes the SkyRemote object with the given bindings.
 *
 * @param {Object[]} bindings - An array of button bindings, each containing button name, keys, and keyCodes.
 * @constructor
 */
	function SkyRemoteAPI(bindings) {
		if (!new.target) throw new Error("Use 'new' with this function");
		if (!bindings || !bindings.length) {
			throw new Error("[SKY REMOTE] No bindings were provided");
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


	/**
	 * List of available buttons on the Sky Remote.
	 * @type {string[]}
	 */
	SkyRemoteAPI.buttons = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'sky', 'tv-guide', 'box-office', 'services', 'interactive', 'i', 'up', 'left', 'down', 'right', 'select', 'channel-up', 'channel-down', 'backup', 'help', 'red', 'green', 'yellow', 'blue'];
	/**
 * Creates an array of button bindings.
 * @returns {Object[]} - An array of button bindings.
 */
	SkyRemoteAPI.createBindings = function () {
		let bindings = [];
		let b = 0;

		console.log("[SKY REMOTE] First button:", SkyRemoteAPI.buttons[b]);

		document.addEventListener("keyup", e => {
			let button = SkyRemoteAPI.buttons[b];
			let binding = bindings.find(b => b.button === button);
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
			if (e.key === "End") {
				b++;
				b %= SkyRemoteAPI.buttons.length;
				console.log("[SKY REMOTE] Progress:", bindings);
				console.log("[SKY REMOTE] Next Button:", SkyRemoteAPI.buttons[b]);

			} else {
				console.log("[SKY REMOTE] Adding new binding for " + button + ":", e.key, e.keyCode);
				binding.keys.push(e.key);
				binding.keyCodes.push(e.keyCode);
			}
		});
	};

	/**
	 * Triggers a keyboard event with the given key code.
	 *
	 * @param {string} event - The type of the keyboard event (e.g., "keydown", "keyup", etc.).
	 * @param {number} key - The key code to be triggered.
	 * @param {HTMLElement} [element=document] - The element on which the event should be triggered (default is document).
	 */
	SkyRemoteAPI.triggerEvent = function (event, key, element = document) {
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

	/**
	 * Returns the version of the SkyRemote API.
	 *
	 * @returns {number[]} - The version as an array of three numbers [major, minor, patch].
	 */
	SkyRemoteAPI.prototype.version = VERSION;

	/**
	 * Prints version information about the SkyRemote API to the console.
	 */
	SkyRemoteAPI.prototype.printVersionInfo = function () {
		console.log(`[STB Gaming Sky Remote API]
Created by: Tumble
Version: ${VERSION.join(".")} (${IS_THIS_USERSCRIPT_DEV ? "Development" : IS_THIS_USERSCRIPT ? "Userscript" : IS_USERSCRIPT ? "Userscript @require" : IS_COMMONJS ? "CommonsJS/Nodejs" : "Website <script>"})`);
	};

	/**
	 * Returns the list of available buttons on the Sky Remote.
	 *
	 * @returns {string[]} - An array of button names.
	 */
	SkyRemoteAPI.prototype.listButtons = function () {
		return SkyRemoteAPI.buttons;
	};

	/**
	 * Returns the binding for the specified button.
	 *
	 * @param {string} btn - The name of the button.
	 * @returns {Object} - The binding object for the specified button.
	 */
	SkyRemoteAPI.prototype.getBinding = function (btn) {
		if (!btn) {
			console.error("[SKY REMOTE] No button was provided");
			return;
		}
		return this.bindings.find(b => b.button === btn);
	};

	/**
	 * Holds the specified button.
	 *
	 * @param {string} btn - The name of the button to be held.
	 * @param {HTMLElement} [element=document] - The element on which the button should be held (default is document).
	 */
	SkyRemoteAPI.prototype.holdButton = function (btn, element = document) {
		if (!btn) {
			console.error("[SKY REMOTE] No button was provided");
			return;
		}
		if (this.listButtons().includes(btn)) {
			let keyCode = this.remote[btn];
			this.heldButtons[keyCode] = true;
			SkyRemoteAPI.triggerEvent("keydown", keyCode, element);
		}
	};


	/**
	 * Adds an event listener for when a button is held.
	 *
	 * @param {string} btn - The name of the button to listen for.
	 * @param {Function} func - The function to be called when the button is held.
	 * @param {HTMLElement} [element=document] - The element on which the event should be listened to (default is document).
	 */
	SkyRemoteAPI.prototype.onHoldButton = function (btn, func, element = document) {
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

	/**
	 * Releases the specified button.
	 *
	 * @param {string} btn - The name of the button to be released.
	 * @param {HTMLElement} [element=document] - The element on which the button should be released (default is document).
	 */
	SkyRemoteAPI.prototype.releaseButton = function (btn, element = document) {
		if (!btn) {
			console.error("[SKY REMOTE] No button was provided");
			return;
		}
		let keyCode = this.remote[btn];
		if (this.heldButtons[keyCode]) {
			SkyRemoteAPI.triggerEvent("keyup", keyCode, element);
			this.heldButtons[keyCode] = false;
		}
	};

	/**
	 * Adds an event listener for when a button is released.
	 *
	 * @param {string} btn - The name of the button to listen for.
	 * @param {Function} func - The function to be called when the button is released.
	 * @param {HTMLElement} [element=document] - The element on which the event should be listened to (default is document).
	 */
	SkyRemoteAPI.prototype.onReleaseButton = function (btn, func, element = document) {
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

	/**
	 * Presses the specified button (holds and then releases).
	 *
	 * @param {string} btn - The name of the button to be pressed.
	 * @param {HTMLElement} [element=document] - The element on which the button should be pressed (default is document).
	 */
	SkyRemoteAPI.prototype.pressButton = function (btn, element = document) {
		if (!btn) {
			console.error("[SKY REMOTE] No button was provided");
			return;
		}
		this.holdButton(btn, element);
		setTimeout(() => this.releaseButton(btn, element), 500);
	};

	/**
	 * Adds an event listener for when a button is pressed (holds and then releases).
	 *
	 * @param {string} btn - The name of the button to listen for.
	 * @param {Function} func - The function to be called when the button is pressed.
	 * @param {HTMLElement} [element=document] - The element on which the event should be listened to (default is document).
	 */
	SkyRemoteAPI.prototype.onPressButton = function (btn, func, element = document) {
		if (!btn) {
			console.error("[SKY REMOTE] No button was provided");
			return;
		}
		if (!func) {
			console.error("[SKY REMOTE] No function was provided");
			return;
		}
		let binding = this.getBinding(btn);

		/**
		 * Event handler for the keyup event.
		 * @param {KeyboardEvent} event - The keyup event object.
		 */
		let handler = e => {
			if (binding.keys.includes(e.key) || binding.keyCodes.includes(e.keyCode)) {
				func.call(this, e);
			}
		};

		element.addEventListener("keyup", e => {
			if (e.key === e.code) { handler(e); }
		});

		element.addEventListener("keypress", handler);
	};

	/**
	 * Registers a set of functions for different remote buttons.
	 * @method
	 * @memberof SkyRemoteAPI
	 * @deprecated This method will be deprecated, use `onPressButton`, `onHoldButton`, and `onReleaseButton` instead.
	 * @param {Object} funcs - An object with legacy button press event functions.
	 *                         Example: { pressRed: function(event) { ... }, pressUp: function(event) { ... } }
	 */
	SkyRemoteAPI.prototype.createSkyRemote = function (funcs) {
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
	 * Converts a button name to the corresponding legacy function name (e.g., "pressRed" for "red").
	 * @method
	 * @memberof SkyRemoteAPI
	 * @param {string} btn - The name of the button.
	 * @returns {string} - The legacy function name.
	 */
	SkyRemoteAPI.prototype.toLegacyFunction = function (btn) {
		if (!btn) {
			console.error("[SKY REMOTE] No button was provided");
			return;
		}
		return "press" + btn.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join("");
	};

	/**
	 * The SkyRemote API object containing all the available functions.
	 * @type {SkyRemoteAPI}
	 */
	exports.SkyRemote = new SkyRemoteAPI([
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
});
