import '../../../scss/main.scss';
import '../../../scss/opentv_epg/epg_header.scss';

const EPGHeaderItem = ({ selected, src, title, href = "#" }) => {
	return <a className={(selected ? "headerSelect " : "") + "epgHeaderItem"} href={href}>
		<img src={src} alt="" />
		<span>{title}</span>
	</a>;
};

export default EPGHeaderItem;
