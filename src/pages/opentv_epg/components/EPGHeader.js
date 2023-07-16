import '../../../scss/main.scss'
import '../../../scss/opentv_epg/epg_header.scss'

const EPGHeader = (props) => {
    return <div className="epgHeader">
        {props.children}
    </div>
}

export default EPGHeader;
