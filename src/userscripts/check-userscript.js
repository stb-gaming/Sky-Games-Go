// eslint-disable-next-line no-undef
const uWindow = typeof unsafeWindow === 'undefined' ? window : unsafeWindow;

function checkUserscript(name, VERSION, windowObjectName = name) {
	const IS_COMMONJS = typeof module !== 'undefined',
		// eslint-disable-next-line no-undef
		IS_USERSCRIPT = IS_COMMONJS ? false : typeof GM_info !== 'undefined',
		// eslint-disable-next-line no-undef
		IS_THIS_USERSCRIPT = IS_USERSCRIPT ? GM_info.script.name === name : false,
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
			default: // this is the same version
				console.debug(`The '${name}' userscript is up to date.`);
				break; // Optionally, you can add a break statement here, though it's not necessary.
		}
	}

	return {
		IS_COMMONJS,
		IS_USERSCRIPT,
		IS_THIS_USERSCRIPT,
		IS_THIS_USERSCRIPT_DEV,
		GET_STARTED
	};
};

export default checkUserscript;
