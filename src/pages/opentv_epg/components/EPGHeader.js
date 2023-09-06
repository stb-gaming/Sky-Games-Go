import '../../../scss/main.scss';
import '../../../scss/opentv_epg/epg_header.scss';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import strftime from '../../../utils/strftime';
import Interactive from '../Interactive';
import Services from '../Services';
import TVGuide from '../TVGuide';
import EPGHeaderItem from './EPGHeaderItem';
import EPGHeaderLogo from './EPGHeaderLogo';
import calculateLastNext from '../../../utils/calculateLastNext';
import SkyRemote from '../../../userscripts/SkyRemote.user';
import BoxOffice from '../BoxOffice';


const EPGHeader = ({ page, title }) => {
	let tabs = [TVGuide.url, BoxOffice.url, Services.url, Interactive.url];
	const navigate = useNavigate();
	useEffect(() => {

		let channelUpRemovalParams, channelDownRemovalParams;
		if (!title) {
			const { last, next } = calculateLastNext(tabs[page - 1], tabs);

			channelUpRemovalParams = SkyRemote.onReleaseButton("channel-up", () => {
				navigate(last);
			});

			channelDownRemovalParams = SkyRemote.onReleaseButton("channel-down", () => {
				navigate(next);
			});
		}
		if (channelUpRemovalParams && channelDownRemovalParams)
			return () => {
				SkyRemote.removeButtonEventListener(...channelUpRemovalParams);
				SkyRemote.removeButtonEventListener(...channelDownRemovalParams);
			};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	});

	useEffect(() => {

		const removalParams = [
			SkyRemote.onReleaseButton("tv-guide", () => {
				navigate(TVGuide.url);
			}),
			SkyRemote.onReleaseButton("box-office", () => {
				navigate(BoxOffice.url);
			}),
			SkyRemote.onReleaseButton("services", () => {
				navigate(Services.url);
			}),
			SkyRemote.onReleaseButton("interactive", () => {
				navigate(Interactive.url);
			})
		];

		return () => {
			for (const paramSet of removalParams) {
				SkyRemote.removeButtonEventListener(...paramSet);
			}
		};
	});


	return <div className="epgHeader">
		<EPGHeaderLogo />
		{
			title ? <div className='epgHeader_text'>
				<span>{strftime.call(new Date(), "%l.%M%P %a %d %b")}</span>
				<h1 className="epg_pageTitle">{title}</h1>
			</div> : <>
				<EPGHeaderItem title="TV GUIDE" src="/assets/img/epg_header_png/guide.png" selected={page === 1} href={tabs[0]} />
				<EPGHeaderItem title="BOX OFFICE" src="/assets/img/epg_header_png/box_office.png" selected={page === 2} href={tabs[1]} />
				<EPGHeaderItem title="SERVICES" src="/assets/img/epg_header_png/services.png" selected={page === 3} href={tabs[2]} />
				<EPGHeaderItem title="INTERACTIVE" src="/assets/img/epg_header_png/interactive.png" selected={page === 4} href={tabs[3]} />
			</>
		}

	</div>;
};

export default EPGHeader;
