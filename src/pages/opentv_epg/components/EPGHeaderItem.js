import { Link } from 'react-router-dom';
import '../../../scss/main.scss';
import '../../../scss/opentv_epg/epg_header.scss';

const EPGHeaderItem = ({ selected, src, title, href = "#" }) => {
	return <Link className={(selected ? "headerSelect " : "") + "epgHeaderItem"} to={href}>
		<img src={src} alt="" />
		<span>{title}</span>
	</Link>;
};

export default EPGHeaderItem;
