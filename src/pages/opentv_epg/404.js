import '../../scss/main.scss';
import '../../scss/opentv_epg/main.scss';

import EPGContainer from './components/EPGContainer';
import EPGHeader from './components/EPGHeader';
import FYIMessage from './components/FYIMessage';

const Page404 = () => {
	return <>
		<EPGContainer>
			<EPGHeader />
			<FYIMessage code="04" />

		</EPGContainer >
	</>;
};

export default Page404;
