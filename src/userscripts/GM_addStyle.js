/**
 * Polyfill for GM_addStyle to add CSS styles to the page head.
 *
 * @param {string} css - The CSS styles to be added to the page.
 * @throws {Error} If the `css` parameter is missing or empty.
 */
function addStyle(css) {
	if (!css) {
		throw new Error("CSS styles must be provided to addStyle_pollyfill");
	}

	const style = document.createElement('style');
	style.textContent = css;
	document.head.appendChild(style);
}


export default addStyle;
