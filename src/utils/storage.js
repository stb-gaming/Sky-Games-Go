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
			JSON.parse(obj); // is the json parsable?
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
		const path = await safeRequire("path");
		let file = path.join(this.folder, name + ".json");
		try {
			const fs = await safeRequire('fs/promises');
			await fs.writeFile(file, valueString);
		} catch (error) {
			console.error("Error writing to file:", error);
		}
	} else {
		localStorage.setItem(name, valueString);
	}
};


Storage.prototype.getItem = async function (name, fallback = null) {
	console.debug(`Retrieving ${name}...`);
	let valueText;
	let retVal;
	if (isElectron() || isReactNative()) {
		const path = await safeRequire("path");
		const file = path.join(this.folder, name + ".json");
		try {
			const fs = await safeRequire('fs/promises');
			valueText = await fs.readFile(file, 'utf8');
		} catch (error) {
			console.error("Error reading file:", error);
			return fallback;
		}
	} else {
		valueText = localStorage.getItem(name);
	}
	retVal = JSON.parse(valueText);
	if (retVal === null)
		return fallback;
	else
		return retVal;
};

const storage = new Storage();
export default storage;
