const userscripts = [
	require('./GM_addStyle'),
	require('./check-userscript'),
	require('./sky-remote.user'),
	//require('./beehive-bedlam.user'),
	//require('./template.user')
	//require('./sky-remote-mobile.user'),
	require('./gamepad-support.user')
];


export function initUserscripts(window) {
	const userscriptExports = {};
	for (const userscript of userscripts) {
		let exports = userscript.init({ ...window, ...userscriptExports });
		for (const key in exports)
			userscriptExports[key] = exports[key];
	}

	for (const key in userscriptExports)
		if (!key.startsWith("GM") && !window.hasOwnProperty(key))
			window[key] = userscriptExports[key];
}
