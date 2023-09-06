import { Music } from '../../../components/Music';
import '../../../scss/main.scss';

const EPGContainer = (props) => {
	return <div className="epgContainer">
		<Music src="/assets/music/sky-universal-dream.mp3" />
		{props.children}
	</div>;
};

export default EPGContainer;
