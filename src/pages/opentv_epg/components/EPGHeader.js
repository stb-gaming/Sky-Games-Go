import '../../../scss/main.scss';
import '../../../scss/opentv_epg/epg_header.scss';
import strftime from '../../../utils/strftime';
import Interactive from '../Interactive';
import Services from '../Services';
import TVGuide from '../TVGuide';
import EPGHeaderItem from './EPGHeaderItem';
import EPGHeaderLogo from './EPGHeaderLogo';

const EPGHeader = ({ page, title }) => {
	return <div className="epgHeader">
		<EPGHeaderLogo />
		{title ? <div className='epgHeader_text'>
			<span>{strftime.call(new Date(), "%l.%M%P %a %d %b")}</span>
			<h1 className="epg_pageTitle">{title}</h1>
		</div> : <>
			<EPGHeaderItem title="TV GUIDE" src="/assets/img/epg_header_png/guide.png" selected={page === 1} href={TVGuide.url} />
			<EPGHeaderItem title="BOX OFFICE" src="/assets/img/epg_header_png/box_office.png" selected={page === 2} href="/box-office" />
			<EPGHeaderItem title="SERVICES" src="/assets/img/epg_header_png/services.png" selected={page === 3} href={Services.url} />
			<EPGHeaderItem title="INTERACTIVE" src="/assets/img/epg_header_png/interactive.png" selected={page === 4} href={Interactive.url} />
		</>
		}

	</div>;
};

export default EPGHeader;
