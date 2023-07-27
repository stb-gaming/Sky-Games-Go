import { Link } from 'react-router-dom';
import '../../scss/main.scss';
import '../../scss/opentv_epg/main.scss';

import EPGContainer from './components/EPGContainer';
import EPGHeader from './components/EPGHeader';
import EPGMenuContainer from './components/EPGMenuContainer';
import EPGMenuItem from './components/EPGMenuItem';

const TVGuideMore = () => {
	return <>
		<EPGContainer>
			<EPGHeader page={1} />
			<div className="epgContentContainer">
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
			</div>

		</EPGContainer>
	</>;
};
TVGuideMore.url = "/tv-guide/more";
export default TVGuideMore;
