import React, { useEffect, useState } from 'react';
import '../../scss/main.scss';
import '../../scss/opentv_epg/main.scss';
import '../../scss/opentv_epg/epg_settings.scss';

import EPGContainer from './components/EPGContainer';
import EPGHeader from './components/EPGHeader';
import packageJson from "../../../package.json";


const SystemDetails = () => {

	const [browserVersion, setBrowserVersion] = useState('Loading...');
	const [environment, setEnvironment] = useState("Loading...");
	const [skyRemoteVersion, setSkyRemoteVersion] = useState("Loading...");
	const [serialNumber, setSerialNumber] = useState("Loading...");

	useEffect(() => {

		document.addEventListener("userscriptsLoaded", ({ detail: { SkyRemote } }) => {
			setSkyRemoteVersion(SkyRemote.version.join("."));
		});
	});

	useEffect(() => {
		let serialNumber = localStorage.getItem("serialNumber");
		if (!serialNumber) {
			serialNumber = Array.from({ length: 10 }, () => Math.round(Math.random() * 9)).join("");
			localStorage.setItem("serialNumber", serialNumber);
		}
		setSerialNumber(serialNumber);
	});



	useEffect(() => {
		// Get the browser version when the component mounts
		const getBrowserVersion = () => {
			const userAgent = navigator.userAgent;
			let version;
			// Use regular expressions to extract the browser version based on the userAgent
			if (/rv:([\d.]+)/.test(userAgent)) {
				version = userAgent.match(/rv:([\d.]+)/)[1];
			} else if (/Edge\/([\d.]+)/.test(userAgent)) {
				version = userAgent.match(/Edge\/([\d.]+)/)[1];
			} else if (/MSIE ([\d.]+)/.test(userAgent)) {
				version = userAgent.match(/MSIE ([\d.]+)/)[1];
			} else if (/Chrome\/([\d.]+)/.test(userAgent)) {
				version = userAgent.match(/Chrome\/([\d.]+)/)[1];
			} else if (/Firefox\/([\d.]+)/.test(userAgent)) {
				version = userAgent.match(/Firefox\/([\d.]+)/)[1];
			} else if (/Version\/([\d.]+).*Safari/.test(userAgent)) {
				version = userAgent.match(/Version\/([\d.]+).*Safari/)[1];
			}
			return version;
		};

		const detectEnvironment = () => {
			if (typeof window === 'undefined' && typeof global === 'object') {
				// Electron environment
				return 'Electron';
			} else if (window && window.navigator && window.navigator.product === 'ReactNative') {
				// React Native environment
				return 'React Native';
			} else {
				// React environment
				return 'React';
			}
		};


		const userAgentData = navigator.userAgentData;
		let browser;
		if (userAgentData) {
			let { brand, version } = userAgentData.brands[userAgentData.brands.length - 1];
			switch (brand) {
				case "Google Chrome": brand = "Chrome"; break;
				default: break;
			}
			browser = brand + " " + version;
		}

		setBrowserVersion(browser || getBrowserVersion());
		setEnvironment(detectEnvironment());
	}, []);


	function onSave(e) {
		e.preventDefault();
	}
	return <>
		<EPGContainer>
			{/* <img alt="" className="reference" src="/assets/img/image0.jpg" /> */}
			<EPGHeader title={"SYSTEM DETAILS"} />
			<div className="epgContentContainer">
				<form id="system-details" onSubmit={onSave} >
					<label htmlFor="manufacturer">Manufacturer</label>
					<input type="text" name="manufacturer" disabled id="" value={packageJson.author} />
					<label htmlFor="model-number">Model Number</label>
					<input type="text" name="model-number" disabled id="" value={environment} />
					<label htmlFor="version-number">Version Number</label>
					<input type="text" name="version-number" disabled id="" value={browserVersion} />
					<label htmlFor="hi">Serial Number</label>
					<input type="text" name="hi" disabled id="" value={serialNumber} />
					<label htmlFor="hi">Viewing Card Number</label>
					<input type="text" name="hi" disabled id="" value={"No card"} />
					<label htmlFor="hi">Operating System Version:</label>
					<input type="text" name="hi" disabled id="" value={React.version} />
					<label htmlFor="hi">EPG Software Version</label>
					<input type="text" name="hi" disabled id="" value={packageJson.version} />
					<label htmlFor="hi">SkyRemote API</label>
					<input type="text" name="hi" disabled id="" value={skyRemoteVersion} />

				</form>
			</div>

		</EPGContainer>


	</>;
};
SystemDetails.url = "/services/system-setup/system-details";
export default SystemDetails;
