import '../../../scss/main.scss';
import '../../../scss/opentv_epg/epg_header.scss';

const EPGHeaderLogo = (props) => {
	return <div className="epgHeaderLogo">
		<img src="/assets/img/epg_header_png/sky-logo-transparent.png" alt="Sky" />
		<span>guide</span>
	</div>;
};

export default EPGHeaderLogo;
