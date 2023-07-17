import '../../scss/main.scss';
import '../../scss/opentv_epg/main.scss';

import EPGContainer from './components/EPGContainer';
import EPGHeader from './components/EPGHeader';
import EPGHeaderItem from './components/EPGHeaderItem';
import EPGHeaderLogo from './components/EPGHeaderLogo';
import FYIMessage from './components/FYIMessage';

const Page404 = () => {
	return <>
		<EPGContainer>
			<EPGHeader>
				<EPGHeaderLogo />
				<EPGHeaderItem title="TV GUIDE" src="/assets/img/epg_header_png/guide.png" />
				<EPGHeaderItem title="BOX OFFICE" src="/assets/img/epg_header_png/box_office.png" />
				<EPGHeaderItem title="SERVICES" src="/assets/img/epg_header_png/services.png" />
				<EPGHeaderItem title="INTERACTIVE" src="/assets/img/epg_header_png/interactive.png" />
			</EPGHeader>
			<FYIMessage code="04">
				The chosen page could not be found.<br />
				Please attempt to access the page again, and<br />
				if the page still cannot be found, please<br />
				contact the webmasters.
			</FYIMessage>

		</EPGContainer >
	</>;
};

export default Page404;
