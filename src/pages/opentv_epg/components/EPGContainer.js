import { Music } from '../../../components/Music';
import '../../../scss/main.scss';

const EPGContainer = (props) => {
	return <div className="epgContainer">
		<Music src="http://letscommunicate.co.uk/skyepgmusic/2005/Sky%20Digital%20-%20Track%203.mp3" />
		{props.children}
	</div>;
};

export default EPGContainer;
