import { useState, useEffect } from 'react';
import '../../scss/main.scss';
import '../../scss/opentv_epg/main.scss';

import EPGContainer from './components/EPGContainer';
import EPGHeader from './components/EPGHeader';
import FYIMessage from './components/FYIMessage';

import SkyRemote from '../../userscripts/SkyRemote.user';
import createMenu from '../../utils/createMenu';

const BoxOffice = () => {

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
			<EPGHeader page={2} />
			<FYIMessage code="05" />
		</EPGContainer>
	</>;
};
BoxOffice.url = "/box-office";
export default BoxOffice;
