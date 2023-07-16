import '../../../scss/main.scss'
import '../../../scss/opentv_epg/fyi_message.scss'

/*
<span className="fyiMessageBody">
            No Satellite Signal is being received.<br/>
            Please unplug your box from the mains, plug<br />
            it back in and wait 5 minutes before trying again.<br />
            If the fault persists, contact customer services.
        </span>
        */

const FYIMessage = (props) => {
    return <div className="fyiMessage">
        <span className="fyiMessageHeader">
            FOR YOUR INFORMATION

            <span className="fyiMessageHeaderErrorCode">
                00
            </span>
        </span>
        <span className="fyiMessageBody">
            This is an FYI message container.<br />
            FYI containers can be used for errors, or other<br />
            things that require immediete attention from the <br/>
            end user.
        </span>
    </div>
}

export default FYIMessage;
