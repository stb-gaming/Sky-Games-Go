import '../../scss/main.scss'
import '../../scss/opentv_epg/main.scss'

import EPGContainer from './components/EPGContainer'
import EPGHeader from './components/EPGHeader';
import EPGHeaderItem from './components/EPGHeaderItem';
import FYIMessage from './components/FYIMessage';

const TestPage = () => {
    return <>
      <EPGContainer>
        <EPGHeader>
          <EPGHeaderItem title="TV GUIDE" src="/assets/img/guide-tab.svg" />
          <EPGHeaderItem title="BOX OFFICE" src="/assets/img/box-office-tab.svg" />
          <EPGHeaderItem title="SERVICES" src="/assets/img/services-tab.svg" />
          <EPGHeaderItem title="INTERACTIVE" src="/assets/img/interactive-tab.svg" />
        </EPGHeader>
        <p>This is in the EPG container</p>
        <FYIMessage />
      </EPGContainer>
    </>;
  };
  
export default TestPage;
  