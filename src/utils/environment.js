

export async function safeRequire(module) {
	try {
		return await import(`${module}`);
	} catch (error) {
		return null;
	}
};
export function isElectron() {
	return (
		typeof window !== 'undefined' &&
		typeof window.process === 'object' &&
		window.process.type === 'renderer'
	);
}

export function isReactNative() {
	return typeof navigator !== 'undefined' && navigator.product === "ReactNative";
}


export async function getUserData() {
	if (isElectron()) {
		const { app } = await safeRequire('electron');
		return app.getPath("userData");
	}
	if (isReactNative()) {
		return await safeRequire('react-native-fs').default.DocumentDirectoryPath;

	}
	return null;
}
