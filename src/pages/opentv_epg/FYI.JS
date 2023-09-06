import '../../scss/main.scss';
import '../../scss/opentv_epg/main.scss';

import EPGContainer from './components/EPGContainer';
import EPGHeader from './components/EPGHeader';
import FYIMessage from './components/FYIMessage';

const PageFYI = () => {
	return <>
		<EPGContainer>
			<EPGHeader title={"FOR YOUR INFORMATION"} />
			<FYIMessage>For your information</FYIMessage>
		</EPGContainer >
	</>;
};

export default Page404;
