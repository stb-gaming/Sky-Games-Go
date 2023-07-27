import { getUserData, isElectron, isReactNative, safeRequire } from "./environment";


function Storage() {
	if (!new.target) throw new Error("Must be called with 'new'");
	this.setFolder(getUserData());
}

Storage.prototype.setFolder = function (folder) {
	this.folder = folder;
};


function conditionalJSONStringify(obj) {
	try {
		if (typeof obj === 'string') {
			JSON.parse(obj);
			return obj;
		} else {
			return JSON.stringify(obj);
		}
	} catch (error) {
		console.error("Error processing json:", error);
		return '';
	}
}

Storage.prototype.setItem = async function (name, value) {
	console.debug(`Saving ${name}...`);
	let valueString = conditionalJSONStringify(value);
	if (isElectron() || isReactNative()) {
		let file = safeRequire("path").join(this.folder, name + ".json");
		try {
			await safeRequire('fs/promises').writeFile(file, valueString);
		} catch (error) {
			console.error("Error writing to file:", error);
		}
	} else {
		localStorage.setItem(name, value);
	}
};


Storage.prototype.getItem = async function (name) {
	console.debug(`Retrieving ${name}...`);
	let valueText;
	if (isElectron() || isReactNative()) {
		const file = safeRequire('path').join(this.folder, name + ".json");
		try {
			valueText = await safeRequire('fs/promises').readFile(file, 'utf8');
		} catch (error) {
			console.error("Error reading file:", error);
			return null;
		}
	} else {
		valueText = localStorage.getItem(name);
	}
	return JSON.parse(valueText);
};

export default new Storage();
