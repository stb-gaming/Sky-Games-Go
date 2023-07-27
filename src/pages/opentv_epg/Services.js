import { Link } from 'react-router-dom';
import '../../scss/main.scss';
import '../../scss/opentv_epg/main.scss';

import EPGContainer from './components/EPGContainer';
import EPGHeader from './components/EPGHeader';
import EPGMenuContainer from './components/EPGMenuContainer';
import EPGMenuItem from './components/EPGMenuItem';
import SystemSettings from './SystemSettings';

const Services = () => {
	return <>
		<EPGContainer>
			<EPGHeader page={3} />
			<div className="epgContentContainer">
				<EPGMenuContainer>
					<Link to={SystemSettings.url}>
						<EPGMenuItem number="1" title="SYSTEM SETTINGS" selected={true} />
					</Link>
				</EPGMenuContainer>
			</div>

		</EPGContainer>
	</>;
};
Services.url = "/services";
export default Services;
