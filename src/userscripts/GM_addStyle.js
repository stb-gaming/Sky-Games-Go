function addStyle_pollyfill(css) {
	const style = document.createElement('style');
	style.textContent = css;
	document.head.appendChild(style);
}

if (!GM_addStyle) {
	GM_addStyle = addStyle_pollyfill;
}

export default GM_addStyle;
