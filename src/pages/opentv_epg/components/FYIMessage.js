import '../../../scss/main.scss';
import '../../../scss/opentv_epg/fyi_message.scss';

/*
<span className="fyiMessageBody">
			No Satellite Signal is being received.<br/>
			Please unplug your box from the mains, plug<br />
			it back in and wait 5 minutes before trying again.<br />
			If the fault persists, contact customer services.
		</span>
		*/

const FYIMessage = ({ code = "00", children }) => {
	return <div className="fyiMessage">
		<span className="fyiMessageHeader">
			FOR YOUR INFORMATION

			<span className="fyiMessageHeaderErrorCode">
				{code}
			</span>
		</span>
		<span className="fyiMessageBody">
			{children}
		</span>
	</div>;
};

export default FYIMessage;
