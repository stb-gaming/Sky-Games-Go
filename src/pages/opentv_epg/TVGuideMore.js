import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../scss/main.scss';
import '../../scss/opentv_epg/main.scss';

import EPGContainer from './components/EPGContainer';
import EPGHeader from './components/EPGHeader';
import EPGMenuContainer from './components/EPGMenuContainer';
import EPGMenuItem from './components/EPGMenuItem';

import SkyRemote from '../../userscripts/SkyRemote.user';
import createMenu from '../../utils/createMenu';
import EPGContentContainer from './components/EPGContentContainer';
import getParentLocation from '../../utils/getParentLocation';

const TVGuideMore = () => {

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
			<EPGHeader page={1} />
			<EPGContentContainer>
				<EPGMenuContainer>
					<EPGMenuItem number="1" title="RADIO" selected={true} />
					<EPGMenuItem number="2" title="SHOPPING" />
					<EPGMenuItem number="3" title="RELIGION" />
					<EPGMenuItem number="4" title="INTERNATIONAL" />
					<EPGMenuItem number="5" title="GAMING & DATING" />
					<EPGMenuItem number="6" title="SPECIALIST" />
					<EPGMenuItem number="7" title="ADULT" />
					<Link to="/">
						<EPGMenuItem number="8" title="BACK..." />
					</Link>
				</EPGMenuContainer>
				<img src="/assets/img/arrow.svg" className="epgArrowUp" alt="There is anouther page" />
			</EPGContentContainer>
		</EPGContainer>
	</>;
};
TVGuideMore.url = "/tv-guide/more";
export default TVGuideMore;
