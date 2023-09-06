/**
 * LIST OF FYI MESSAGES
 * 01: Insert your Sky viewing card
 * 02: There is a problem with your sky viewing card<br/>Ensure your Sky viewing card<br/>is correctly inserted<br/>Call the broadcaster for assistance
 * 07: This is the wrong card for this Set Top Box<br/>Insert the correct Sky viewing card<br>Call 08702 404040 for assistance
 * 08: This programme is not available
 * 25: No Satellite Signal is being received.<br/>Please unplug your box from the mains, then plug<br/>it back in and wait 5 minutes before trying again,<br/>if the fault persists, contact customer services.
 * 28: No Satellite signal is being received
 * 29: No Satellite Signal is being received.<br/>Please unplug your box from the mains, then plug<br/>it back in and wait 5 minutes before trying again,<br/>if the fault persists, contact customer services.
 * 30: There is a technical fault with this channel<br/>Please try again later
 * 32: There is a technical fault with this channel<br/>Please try again later
 * 36: No Satellite signal is being received
 *
 */
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
const messages = {
	[null]: <>There are no message alerts</>,
	'04': <>The chosen page could not be found.<br />
		Please attempt to access the page again, and<br />
		if the page still cannot be found, please<br />
		contact the webmasters.</>,
	'24': <>
		No Satellite Signal is being received.< br />
		Please unplug your box from the mains, plug<br />
		it back in and wait 5 minutes before trying again.< br />
		If the fault persists, contact customer services.</>,

	'01': <>Insert your Sky viewing card</>,
	'02': <>There is a problem with your sky viewing card<br />Ensure your Sky viewing card<br />is correctly inserted<br />Call the broadcaster for assistance</>,
	'05': <>This page is currently under construction.<br />Please try again later.</>,
	'07': <>This is the wrong card for this Set Top Box<br />Insert the correct Sky viewing card<br />Call 08702 404040 for assistance</>,
	'08': <>This programme is not available</>,
	'25': <>No Satellite Signal is being received.<br />Please unplug your box from the mains, then plug<br />it back in and wait 5 minutes before trying again,<br />if the fault persists, contact customer services.</>,
	'28': <>No Satellite signal is being received</>,
	'29': <>No Satellite Signal is being received.<br />Please unplug your box from the mains, then plug<br />it back in and wait 5 minutes before trying again,<br />if the fault persists, contact customer services.</>,
	'30': <>There is a technical fault with this channel<br />Please try again later</>,
	'32': <>There is a technical fault with this channel<br />Please try again later</>,
	'36': <>No Satellite signal is being received</>,
};

const FYIMessage = ({ code, children }) => {
	return <div className="fyiMessage">
		<span className="fyiMessageHeader">
			FOR YOUR INFORMATION

			<span className="fyiMessageHeaderErrorCode">
				{code}
			</span>
		</span>
		<span className="fyiMessageBody">
			{messages[code] || children || messages[null]}
		</span>
	</div>;
};

export default FYIMessage;
