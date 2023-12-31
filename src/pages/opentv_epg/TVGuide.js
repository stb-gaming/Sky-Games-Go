import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../scss/main.scss';
import '../../scss/opentv_epg/main.scss';
import createMenu from '../../utils/createMenu';

import EPGContainer from './components/EPGContainer';
import EPGHeader from './components/EPGHeader';
import EPGMenuContainer from './components/EPGMenuContainer';
import EPGMenuItem from './components/EPGMenuItem';

import SkyRemote from '../../userscripts/SkyRemote.user';
import EPGContentContainer from './components/EPGContentContainer';

const TVGuide = () => {
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
			<EPGHeader page={1} />
			<EPGContentContainer>
				<EPGMenuContainer>
					<EPGMenuItem number="1" title="ALL CHANNELS" selected={true} />
					<EPGMenuItem number="2" title="HD CHANNELS" />
					<EPGMenuItem number="3" title="ENTERTAINMENT" />
					<EPGMenuItem number="4" title="LIFESTYLE & CULTURE" />
					<EPGMenuItem number="5" title="MOVIES" />
					<EPGMenuItem number="6" title="SPORTS" />
					<EPGMenuItem number="7" title="NEWS" />
					<EPGMenuItem number="8" title="DOCUMENTARIES" />
					<EPGMenuItem number="9" title="KIDS" />
					<Link to="/tv-guide/more">
						<EPGMenuItem number="0" title="MORE..." />
					</Link>
				</EPGMenuContainer>
				<img src="/assets/img/arrow.svg" className="epgArrowDown" alt="There is another page" />
			</EPGContentContainer>
		</EPGContainer>
	</>;
};
TVGuide.url = "/tv-guide";
export default TVGuide;
