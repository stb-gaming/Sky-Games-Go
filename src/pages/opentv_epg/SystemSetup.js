import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../scss/main.scss';
import '../../scss/opentv_epg/main.scss';
import Settings from '../sky_games/Settings';
import createMenu from '../../utils/createMenu';

import EPGContainer from './components/EPGContainer';
import EPGHeader from './components/EPGHeader';
import EPGMenuContainer from './components/EPGMenuContainer';
import EPGMenuItem from './components/EPGMenuItem';
import SystemDetails from './SystemDetails';
import SoundSettings from './SoundSettings';

import SkyRemote from '../../userscripts/SkyRemote.user';
import EPGContentContainer from './components/EPGContentContainer';
import getParentLocation from '../../utils/getParentLocation';

const SystemSetup = () => {

	const [bindsSetup, setBindsSetup] = useState(false);
	const [menu] = useState(createMenu({ itemSelector: ".epgMenuContainer li" }));
	const navigate = useNavigate();

	useEffect(() => {
		let epgMenu = document.querySelector(".epgMenuContainer");
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
	return <>
		<EPGContainer>
			<EPGHeader title={"SYSTEM SETUP"} />
			<EPGContentContainer>
				<EPGMenuContainer>
					<Link to={Settings.url}>
						<EPGMenuItem number="1" title="SKY GAMES SETTINGS" />
					</Link>
					<Link to={SoundSettings.url}>
						<EPGMenuItem number="2" title="SOUND SETTINGS" />
					</Link>
					<Link to={SystemDetails.url}>
						<EPGMenuItem number="3" title="SYSTEM DETAILS" />
					</Link>
				</EPGMenuContainer>
			</EPGContentContainer>

		</EPGContainer>
	</>;
};
SystemSetup.url = "/services/system-setup";
export default SystemSetup;
