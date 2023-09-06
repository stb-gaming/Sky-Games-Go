import { useContext, useEffect, useState } from 'react';
import { MusicContext } from '../../components/Music';
import '../../scss/main.scss';
import '../../scss/opentv_epg/main.scss';
import '../../scss/opentv_epg/epg_settings.scss';
import createMenu from '../../utils/createMenu';

import EPGContainer from './components/EPGContainer';
import EPGHeader from './components/EPGHeader';
import { useNavigate } from 'react-router-dom';
import storage from '../../utils/storage';

import SkyRemote from '../../userscripts/SkyRemote.user';
import EPGContentContainer from './components/EPGContentContainer';
import getParentLocation from '../../utils/getParentLocation';

const SoundSettings = () => {

	const navigate = useNavigate();
	const musicContext = useContext(MusicContext);
	const [bindsSetup, setBindsSetup] = useState(false);
	const [menu] = useState(createMenu({ itemSelector: "input" }));

	useEffect(() => {
		let epgMenu = document.getElementById("soundSettings");
		if (epgMenu) menu.setPages([epgMenu]);

		if (bindsSetup) return;
		setBindsSetup(true);

		const removalParams = [
			...["up", "down", "left", "right"].map(direction => SkyRemote.onReleaseButton(direction, () => {
				menu[direction]();
			})),
			SkyRemote.onReleaseButton("select", () => {
				menu.getSelected().click();
			}),
			SkyRemote.onReleaseButton("backup", () => {
				navigate(getParentLocation(window.location.pathname));
			})
		];
		console.debug("Sky Remote bound");
		return () => {
			setBindsSetup(false);
			for (const paramSet of removalParams) {
				SkyRemote.removeButtonEventListener(...paramSet);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [menu]);

	function onMute({ target }) {
		musicContext.changeMute(target.checked);
	};
	function onVolChange({ target }) {
		musicContext.changeVolume(target.value);
	};

	function onSave(e) {
		e.preventDefault();
		let form = new FormData(e.target);
		let soundSettings = {};

		form.forEach((v, k) => {
			soundSettings[k] = v;
		});

		storage.setItem("soundSettings", soundSettings);
		navigate("/services/system-setup");
	}

	return <>
		<EPGContainer>
			{/* <img alt="" className="reference" src="/assets/img/image0.jpg" /> */}
			<EPGHeader title={"SOUND SETTINGS"} />
			<EPGContentContainer>
				<form id="soundSettings" onSubmit={onSave} action="#">
					<label htmlFor="volume">Volume</label>
					<input type="range" id="volumeSlider" name="volume" onChange={onVolChange} value={musicContext.volume} min={0} max={1} step={.1} data-x="0" />
					<label htmlFor="muted">Muted</label>
					<input type="checkbox" name="muted" onChange={onMute} value={musicContext.muted} data-x="0" />
					<input type="submit" value="Save New Settings" />
				</form>
			</EPGContentContainer>
		</EPGContainer>
	</>;
};
SoundSettings.url = "/services/system-settings/sound-settings";
export default SoundSettings;
