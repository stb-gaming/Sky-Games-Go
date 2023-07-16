import { useState } from 'react';
import '../../../scss/main.scss'
import '../../../scss/opentv_epg/epg_menu.scss'

const EPGMenuItem = (props) => {
    const [isShown, setIsShown] = useState(props.selected);


    return <li className={(isShown ? "itemSelected" : "")} onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)}>
        <div className={(isShown ? "menuNumber menuNumberSelected" : "menuNumber")}>
            <span>{props.number}</span>
        </div>
        <span className={(isShown ? "title titleSelected" : "title")}>{props.title}</span>
    </li>
}

export default EPGMenuItem;
