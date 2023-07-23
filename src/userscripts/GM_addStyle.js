const init = function () {
	'use strict';

	// eslint-disable-next-line no-undef
	const uWindow = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;

	function GM_addStyle(css) {
		const style = document.createElement('style');
		style.textContent = css;
		document.head.appendChild(style);
	}

	uWindow.GM_addStyle = GM_addStyle;

};



if (typeof module == "undefined") {
	init();
	init = undefined;
} else {
	module.exports.init = init;
}
