/**
* Emit a custom event
* @param {String} name - The name of the event
* @param {Object} data - Any data to pass to the event
*/
export default function emitEvent(name, data = {}) {
	const customEvent = new CustomEvent(name, { detail: data });
	document.dispatchEvent(customEvent);
}
