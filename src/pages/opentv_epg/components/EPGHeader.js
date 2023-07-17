import '../../../scss/main.scss';
import '../../../scss/opentv_epg/epg_header.scss';
import EPGHeaderItem from './EPGHeaderItem';
import EPGHeaderLogo from './EPGHeaderLogo';

const EPGHeader = ({ page }) => {
	return <div className="epgHeader">
		<EPGHeaderLogo />
		<EPGHeaderItem title="TV GUIDE" src="/assets/img/epg_header_png/guide.png" selected={page === 1} href="/" />
		<EPGHeaderItem title="BOX OFFICE" src="/assets/img/epg_header_png/box_office.png" selected={page === 2} href="/box-office" />
		<EPGHeaderItem title="SERVICES" src="/assets/img/epg_header_png/services.png" selected={page === 3} href="/services" />
		<EPGHeaderItem title="INTERACTIVE" src="/assets/img/epg_header_png/interactive.png" selected={page === 4} href="/interactive" />
	</div>;
};

export default EPGHeader;
