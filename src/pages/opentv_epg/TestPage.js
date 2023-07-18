import { Link } from 'react-router-dom';
import { Music } from '../../components/Music';
import '../../scss/main.scss';
import '../../scss/opentv_epg/main.scss';

import EPGContainer from './components/EPGContainer';
import EPGHeader from './components/EPGHeader';
import EPGMenuContainer from './components/EPGMenuContainer';
import EPGMenuItem from './components/EPGMenuItem';

const TestPage = () => {
	return <>
		<EPGContainer>
			<EPGHeader page={1} />
			<div className="epgContentContainer">
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
					<Link to="/more">
						<EPGMenuItem number="0" title="MORE..." />
					</Link>
				</EPGMenuContainer>

				<img src="/assets/img/arrow.svg" className="epgArrowDown" alt="There is another page" />
			</div>

		</EPGContainer>
	</>;
};

export default TestPage;
