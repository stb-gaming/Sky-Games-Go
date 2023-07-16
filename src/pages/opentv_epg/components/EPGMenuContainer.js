import '../../../scss/main.scss'
import '../../../scss/opentv_epg/epg_menu.scss'

const EPGMenuContainer = (props) => {
    return <ul className="epgMenuContainer">
        {props.children}
    </ul>
}

export default EPGMenuContainer;
