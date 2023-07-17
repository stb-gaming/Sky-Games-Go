import { useState } from 'react';
import '../../../scss/main.scss';
import '../../../scss/opentv_epg/epg_menu.scss';

const EPGMenuItem = ({ selected, number, title }) => {
	const [isShown, setIsShown] = useState(selected);


	return <li className={(isShown ? "itemSelected" : "")} onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)}>
		<div className={(isShown ? "menuNumber menuNumberSelected" : "menuNumber")}>
			<span>{number}</span>
		</div>
		<span className={(isShown ? "title titleSelected" : "title")}>{title}</span>
	</li>;
};

export default EPGMenuItem;
