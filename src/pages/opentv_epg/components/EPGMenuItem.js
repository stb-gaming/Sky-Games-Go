import { useState } from 'react';
import '../../../scss/main.scss';
import '../../../scss/opentv_epg/epg_menu.scss';

const EPGMenuItem = ({ selected, number, title }) => {


	return <li>
		<div className="menuNumber">
			<span>{number}</span>
		</div>
		<span className="title">{title}</span>
	</li >;
};

export default EPGMenuItem;
