import '../../../scss/main.scss';
import '../../../scss/opentv_epg/epg_menu.scss';

const EPGContentContainer = (props) => {
	return <div className="epgContentContainer">
		{props.children}
	</div>;
};

export default EPGContentContainer;
