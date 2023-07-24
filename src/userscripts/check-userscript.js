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
})(function ({ uWindow, exports }) {

	function checkUserscript(name, VERSION, windowObjectName = name) {
		const IS_COMMONJS = typeof module != 'undefined',
			// eslint-disable-next-line no-undef
			IS_USERSCRIPT = IS_COMMONJS ? false : typeof GM_info != 'undefined',
			// eslint-disable-next-line no-undef
			IS_THIS_USERSCRIPT = IS_USERSCRIPT ? GM_info.script.name == name : false,
			// eslint-disable-next-line no-undef
			IS_THIS_USERSCRIPT_DEV = IS_THIS_USERSCRIPT && GM_info.scriptUpdateURL.startsWith("file://"),
			GET_STARTED = !uWindow[windowObjectName];


		if (!GET_STARTED) {
			let comp = (a = [0, 0, 0], b = [0, 0, 0]) => (a < b) - (b < a);
			switch (comp(uWindow[windowObjectName].version, VERSION)) {
				case 1: // this is newer
					console.warn(`There are userscripts that are using an older version of '${name}'.
	Try reinstalling all active userscripts.`);
					break;
				case -1: // this is older
					if (IS_THIS_USERSCRIPT)
						console.warn(` The '${name}' (the userscript) is out of date.
	Update this userscript.`);
					else if (IS_USERSCRIPT)
						// eslint-disable-next-line no-undef
						console.warn(`'${GM_info.script.name}' using an older version of '${name}'.
	Try reinstalling this mod.`);
					else
						console.warn(`This website using an older version of '${name}'.
	Try refreshing the website. or contact the website owner`);
					break;
			}
		} else {
			exports[windowObjectName] = { version: VERSION };
		}

		return {
			IS_COMMONJS,
			IS_USERSCRIPT,
			IS_THIS_USERSCRIPT,
			IS_THIS_USERSCRIPT_DEV,
			GET_STARTED
		};
	}

	const VERSION = [0, 1, 1],
		{ GET_STARTED } = checkUserscript("STBG Check Userscript", VERSION, "checkUserscript");


	if (GET_STARTED) {
		checkUserscript.version = VERSION;
		exports.checkUserscript = checkUserscript;
	}

});
