import '../../../scss/main.scss'
import '../../../scss/opentv_epg/epg_header.scss'

const EPGHeaderItem = (props) => {
    return <div className={props.selected ? "epgHeaderItem headerSelect" : "epgHeaderItem"}>
        <img src={props.src} />
        <span>{props.title}</span>
    </div>
}

export default EPGHeaderItem;
