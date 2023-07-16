import { Link } from 'react-router-dom';
import '../../scss/main.scss'
import '../../scss/opentv_epg/main.scss'

import EPGContainer from './components/EPGContainer'
import EPGHeader from './components/EPGHeader';
import EPGHeaderItem from './components/EPGHeaderItem';
import EPGHeaderLogo from './components/EPGHeaderLogo';
import EPGMenuContainer from './components/EPGMenuContainer';
import EPGMenuItem from './components/EPGMenuItem';
import FYIMessage from './components/FYIMessage';

const TestPageMore = () => {
    return <>
      <EPGContainer>
        <EPGHeader>
          <EPGHeaderLogo />
          <EPGHeaderItem title="TV GUIDE" src="/assets/img/epg_header_png/guide.png" selected={true} />
          <EPGHeaderItem title="BOX OFFICE" src="/assets/img/epg_header_png/box_office.png" />
          <EPGHeaderItem title="SERVICES" src="/assets/img/epg_header_png/services.png" />
          <EPGHeaderItem title="INTERACTIVE" src="/assets/img/epg_header_png/interactive.png" />
        </EPGHeader>
        <div className="epgContentContainer">
          <EPGMenuContainer>
              <EPGMenuItem number="1" title="RADIO" selected={true} />
              <EPGMenuItem number="2" title="SHOPPING" />
              <EPGMenuItem number="3" title="RELIGION" />
              <EPGMenuItem number="4" title="INTERNATIONAL" />
              <EPGMenuItem number="5" title="GAMING & DATING" />
              <EPGMenuItem number="6" title="SPECIALIST"/>
              <EPGMenuItem number="7" title="ADULT" />
              <Link to="/">
                <EPGMenuItem number="8" title="BACK..." />
              </Link>
          </EPGMenuContainer>

          <img src="/assets/img/arrow.svg" className="epgArrowUp"/>
        </div>
        
      </EPGContainer>
    </>;
  };
  
export default TestPageMore;
  