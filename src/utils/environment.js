

export function safeRequire(...args) {
	try {
		return require(...args);
	} catch (error) {
		return null;
	}
}
export function isElectron() {
	return (
		typeof window !== 'undefined' &&
		typeof window.process === 'object' &&
		window.process.type === 'renderer'
	);
}

export function isReactNative() {
	return typeof navigator !== 'undefined' && navigator.product == "ReactNative";
}


export function getUserData() {
	if (isElectron()) {
		const { app } = safeRequire('electron');
		return app.getPath("userData");
	}
	if (isReactNative()) {
		return safeRequire('react-native-fs').default.DocumentDirectoryPath;

	}
	return null;
}
