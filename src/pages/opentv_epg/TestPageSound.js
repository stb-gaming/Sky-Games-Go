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

/*
localStorage.setItem('soundSettings',{
	volume:1,
	muted:"false
})
*/

const SoundSettings = () => {

	const navigate = useNavigate();
	const musicContext = useContext(MusicContext);
	const [bindsSetup, setBindsSetup] = useState(false);
	const [menu] = useState(createMenu({ itemSelector: "input" }));

	useEffect(() => {
		let form = new FormData(document.getElementById("sound-settings"));
		let soundSettings = {};

		form.forEach((v, k) => {
			soundSettings[k] = v;
		});

	}, []);

	useEffect(() => {
		let epgMenu = document.querySelector("#sound-settings");
		if (epgMenu) menu.setPages([epgMenu]);
		console.debug("menu setup");

		if (bindsSetup) return;
		document.addEventListener("userscriptsLoaded", ({ detail: { SkyRemote } }) => {
			if (bindsSetup) return;
			setBindsSetup(true);
			SkyRemote.onReleaseButton("up", () => {
				menu.up();
			});
			SkyRemote.onReleaseButton("down", () => {
				menu.down();
			});
			SkyRemote.onReleaseButton("left", () => {
				menu.left();
			});
			SkyRemote.onReleaseButton("right", () => {
				menu.right();
			});
			SkyRemote.onReleaseButton("backup", () => {
				navigate(-1);
			});
			console.debug("sky remote bound");
		});
	}, [bindsSetup, menu, navigate]);

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
		console.log(soundSettings);

		storage.setItem("soundSettings", soundSettings);
		navigate("/services/system-settings");
	}


	return <>
		<EPGContainer>
			{/* <img alt="" className="reference" src="/assets/img/image0.jpg" /> */}
			<EPGHeader title={"SOUND SETTINGS"} />
			<div className="epgContentContainer">
				<form id="sound-settings" onSubmit={onSave} action="#">
					<label htmlFor="volume">Volume</label>
					<input type="range" id="volumeSlider" name="volume" onChange={onVolChange} value={musicContext.volume} min={0} max={1} step={.1} />
					<label htmlFor="muted">Muted</label>
					<input type="checkbox" name="muted" onChange={onMute} value={musicContext.muted} />
					<input type="submit" value="Save New Settings" />

				</form>
			</div>

		</EPGContainer>


	</>;
};
SoundSettings.url = "/services/system-settings/sound-settings";
export default SoundSettings;
