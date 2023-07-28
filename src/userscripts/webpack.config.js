const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

const userscripts = {
	'SkyRemote': { path: './src/userscripts/SkyRemote.user.js', exportsLibrary: true },
	'BeehiveBedlam': { path: './src/userscripts/BeehiveBedlam.user.js', exportsLibrary: true },
	'SkyRemoteMobile': { path: './src/userscripts/SkyRemoteMobile.user.js', exportsLibrary: false },
	'gamepadSupport': { path: './src/userscripts/gamepadSupport.user.js', exportsLibrary: false }
};


class UserscriptExportPlugin {
	constructor() {
	}

	extractNameFromEntry(entryName) {
		const regex = /^(.*?)\.user\.js$/;
		const match = entryName.match(regex);
		if (match && match[1]) {
			return match[1];
		} else {
			console.error(`Unable to extract [name] from '${entryName}', using '${entryName}' instead.`);
			return entryName;
		}
	}

	apply(compiler) {
		compiler.hooks.emit.tapAsync('CustomLibraryExportPlugin', (compilation, callback) => {
			for (const entryName in compilation.assets) {
				if (!fs.existsSync(path.join(__dirname, entryName))) continue;
				const name = this.extractNameFromEntry(entryName);
				const librayCode = this.generateLibraryCode(name, entryName, compilation.assets[entryName].source());
				const assetName = `${name}.user.js`;
				compilation.assets[assetName] = {
					source: () => librayCode,
					size: () => librayCode.length
				};
			}

			callback();
		});
	}

	generateLibraryCode(name, entryName, source) {

		return `${this.getHeader(entryName)}
(function() {
	"use strict";
	${source}${userscripts[name].exportsLibrary ? `
	const uWindow = typeof unsafeWindow === 'undefined' ? window : unsafeWindow;
	if(typeof ${name} !== 'undefined' || typeof uWindow['${name}'] !== 'undefined' ) uWindow["${name}"] = uWindow["${name}"]||${name};` : ''}
})(); `;
	}

	getHeader(file) {
		try {
			const fileContent = fs.readFileSync(path.join(__dirname, file), 'utf8');

			// Extract the header from the file content using regex.
			const headerRegex = /\/\/ ==UserScript==([\s\S]*?)\/\/ ==\/UserScript==/;
			const headerMatch = fileContent.match(headerRegex);

			// Check if a header was found and return it.
			if (headerMatch && headerMatch.length > 0) {
				return headerMatch[0]; // Full match (including // ==UserScript== and // ==/UserScript==).
			} else {
				console.warn(`Header not found for ${file}.`);
				return '';
			}
		} catch (err) {
			console.error(`Error reading header for ${file}: `, err);
			return '';
		}
	};
}

const PRODUCTION_MODE = process.env.NODE_ENV === 'production' || process.env.CI || process.env.CI == 'true';


// Base configuration for both userscripts
const baseConfig = {
	mode: PRODUCTION_MODE ? 'production' : 'development',
	target: 'web',
	output: {
		path: path.resolve(__dirname, '../../build/userscripts'),
		filename: '[name].user.js',
	},
	resolve: {
		extensions: ['.js'],
	},

	// module: {
	// 	rules: [
	// 		{
	// 			test: /\.js$/,
	// 			exclude: /node_modules/,
	// 			use: {
	// 				loader: 'babel-loader',
	// 				options: {
	// 					presets: ['@babel/preset-env'],
	// 				},
	// 			},
	// 		},
	// 	],
	// },
	plugins: [
		// Add the UserscriptExportPlugin
		new UserscriptExportPlugin()
	]
};

// Configuration for userscripts with exportsLibrary set to true
const userscriptsWithLibraryConfig = {
	...baseConfig,
	name: 'userscriptsWithLibrary',
	entry: Object.fromEntries(
		Object.entries(userscripts)
			.filter(([name, config]) => config.exportsLibrary)
			.map(([name, config]) => [name, config.path])
	),
	output: {
		...baseConfig.output,
		library: {
			type: 'var',
			name: '[name]',
			export: 'default',
		},
	},
};

// Configuration for userscripts without exportsLibrary
const userscriptsWithoutLibraryConfig = {
	...baseConfig,
	name: 'userscriptsWithoutLibrary',
	entry: Object.fromEntries(
		Object.entries(userscripts)
			.filter(([name, config]) => !config.exportsLibrary)
			.map(([name, config]) => [name, config.path])
	),
	// Specify the dependency on userscriptsWithLibrary
	dependencies: ['userscriptsWithLibrary'],
};

module.exports = (env, argv) => {
	if (PRODUCTION_MODE || argv.mode === 'production') {
		// Enable caching for production build
		baseConfig.cache = {
			type: 'filesystem',
		};
	}

	return [userscriptsWithLibraryConfig, userscriptsWithoutLibraryConfig];
};
