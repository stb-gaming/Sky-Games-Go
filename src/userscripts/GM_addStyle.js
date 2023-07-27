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
})(function ({ exports }) {

	function GM_addStyle(css) {
		const style = document.createElement('style');
		style.textContent = css;
		document.head.appendChild(style);
	}

	exports.GM_addStyle = GM_addStyle;

});
