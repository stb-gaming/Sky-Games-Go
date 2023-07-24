function emitEvent(name, data = {}) {
	const customEvent = new CustomEvent(name, { detail: data });
	document.dispatchEvent(customEvent);
}

export default emitEvent;
