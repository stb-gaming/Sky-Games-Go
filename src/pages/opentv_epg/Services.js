import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../scss/main.scss';
import '../../scss/opentv_epg/main.scss';

import EPGContainer from './components/EPGContainer';
import EPGHeader from './components/EPGHeader';
import EPGContentContainer from './components/EPGContentContainer';
import EPGMenuContainer from './components/EPGMenuContainer';
import EPGMenuItem from './components/EPGMenuItem';
import SystemSetup from './SystemSetup';

import SkyRemote from '../../userscripts/SkyRemote.user';
import createMenu from '../../utils/createMenu';

const Services = () => {

	const [bindsSetup, setBindsSetup] = useState(false);
	const [menu] = useState(createMenu({ itemSelector: ".epgMenuContainer li" }));

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
			<EPGHeader page={3} />
			<EPGContentContainer>
				<EPGMenuContainer>
					<Link to={SystemSetup.url}>
						<EPGMenuItem number="1" title="SYSTEM SETUP" selected={true} />
					</Link>
				</EPGMenuContainer>
			</EPGContentContainer>

		</EPGContainer>
	</>;
};
Services.url = "/services";
export default Services;
