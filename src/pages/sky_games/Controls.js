import { Music, MusicContext } from '../../components/Music';
import '../../scss/skyGames/main.scss';
import { useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SkyGamesLink from './components/SkyGamesLink.js';
import SkyGamesLogo from './components/SkyGamesLogo';

const Controls = () => {
	const whiteFade = useRef();
	const [isPageLoaded, setIsPageLoaded] = useState(false);
	const location = useLocation();
	const { toggleMute } = useContext(MusicContext);

	useEffect(() => {
		// Simulating the page loading process
		const fakePageLoadTimeout = setTimeout(() => {
			setIsPageLoaded(true);
		}, 500); // Adjust the duration to simulate the page load time (in milliseconds)

		// Cleanup the timeout on unmount to avoid memory leaks
		return () => clearTimeout(fakePageLoadTimeout);
	}, []);


	// This effect will run whenever the "isPageLoaded" state changes
	useEffect(() => {
		if (isPageLoaded) {
			// When the page is loaded, remove the white fade
			whiteFade.current.classList.add("done");
		}
	}, [isPageLoaded]);

	// This effect will run whenever the location changes
	useEffect(() => {
		// Remove the "done" class to reset the fade effect on location change
		if (whiteFade.current) {
			whiteFade.current.classList.remove("done");
		}

		// Fade the white background back in after a short delay (50ms in this case)
		const fadeInTimeout = setTimeout(() => {
			whiteFade.current.classList.add("done");
		}, 500);

		// Cleanup the timeout on unmount to avoid memory leaks
		return () => clearTimeout(fadeInTimeout);
	}, [location]);



	return <div className="skyGames">
		{/* <img src="/assets/img/reference.jpg" alt="reference" className="skyGames_reference" /> */}
		<Music src="/assets/music/sky-games.mp3" />
		<div className="skyGamesHeader">
			<SkyGamesLogo />
			<h1>Controls</h1>
		</div>
		<div className="skyGamesMain">
			<div id="skyGames_fade" className={`${isPageLoaded ? "done" : ""}`} ref={whiteFade} />
			<div className="skyGamesMainContainer">
				<p>Yay!</p>
			</div>
		</div>
		<div className="skyGames_footer">
			<div className="skyGames_footerContainer">
				<SkyGamesLink to="/sky-games/controls" className="skyGames_colorRed">Controls</SkyGamesLink>
				<SkyGamesLink to="/sky-games/1" className="skyGames_colorGreen">All Games</SkyGamesLink>
				<SkyGamesLink to="#" onClick={toggleMute} className="skyGames_colorYellow">Toggle Music</SkyGamesLink>
				<SkyGamesLink to="#" className="skyGames_colorBlue">Enter Code</SkyGamesLink>
			</div>
		</div>
	</div>;
};

export default Controls;
