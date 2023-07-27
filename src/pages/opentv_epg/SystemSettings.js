import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../scss/main.scss';
import '../../scss/opentv_epg/main.scss';
import Settings from '../sky_games/Settings';
import createMenu from './../../utils/createMenu';

import EPGContainer from './components/EPGContainer';
import EPGHeader from './components/EPGHeader';
import EPGMenuContainer from './components/EPGMenuContainer';
import EPGMenuItem from './components/EPGMenuItem';
import SystemDetails from './SystemDetails';
import SoundSettings from './TestPageSound';

const SystemSettings = () => {

	const [bindsSetup, setBindsSetup] = useState(false);

	const [menu] = useState(createMenu({ itemSelector: ".epgMenuContainer li" }));

	useEffect(() => {
		let epgMenu = document.querySelector(".epgMenuContainer");
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
			console.debug("sky remote bound");
		});
	}, [bindsSetup, menu]);
	return <>
		<EPGContainer>
			<EPGHeader title={"SYSTEM SETTINGS"} />
			<div className="epgContentContainer">
				<EPGMenuContainer>
					<Link to={Settings.url}>
						<EPGMenuItem number="1" title="SKY GAMES SETTINGS" />
					</Link>
					<Link to={SoundSettings.url}>
						<EPGMenuItem number="2" title="SOUND SETTINGS" />
					</Link>
					<Link to={SystemDetails.url}>
						<EPGMenuItem number="5" title="SYSTEM DETAILS" />
					</Link>
				</EPGMenuContainer>
			</div>

		</EPGContainer>
	</>;
};
SystemSettings.url = "/services/system-settings";
export default SystemSettings;
