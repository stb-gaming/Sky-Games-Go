import { Music, MusicContext } from '../../components/Music';
import '../../scss/skyGames/main.scss';
import { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import SkyGamesLink from './components/SkyGamesLink.js';
import SkyGamesLogo from './components/SkyGamesLogo';
import SkyGames from './SkyGames';
import Controls from './Controls';

const Settings = () => {
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
			<h1>Settings</h1>
		</div>
		<div className="skyGamesMain">
			<div id="skyGames_fade" className={`${isPageLoaded ? "done" : ""}`} ref={whiteFade} />
			<div className="skyGamesMainContainer">
				<h2>Userscripts</h2>
				<ul id="userscript-links">
					<li><Link to="https://raw.githubusercontent.com/stb-gaming/Sky-Games-X/master/src/userscripts/sky-remote.user.js">Sky Remote API</Link></li>
					<li><Link to="https://raw.githubusercontent.com/stb-gaming/Sky-Games-X/master/src/userscripts/gamepad-support.user.js">Gamepad Support</Link></li>
					<li><Link to="https://raw.githubusercontent.com/stb-gaming/Sky-Games-X/master/src/userscripts/sky-remote-mobile.user.js">Mobile Touchpad</Link></li>
					<li><Link to="https://raw.githubusercontent.com/stb-gaming/Sky-Games-X/master/src/userscripts/beehive-bedlam.user.js">Beehive Bedlam Helper</Link></li>
				</ul>
			</div>
		</div >
		<div className="skyGames_footer">
			<div className="skyGames_footerContainer">
				<SkyGamesLink to={Controls.url} className="skyGames_colorRed">Controls</SkyGamesLink>
				<SkyGamesLink to={SkyGames.url + "/1"} className="skyGames_colorGreen">All Games</SkyGamesLink>
				<SkyGamesLink to="#" onClick={toggleMute} className="skyGames_colorYellow">Toggle Music</SkyGamesLink>
				<SkyGamesLink to={SkyGames.url} className="skyGames_colorBlue">Settings</SkyGamesLink>
			</div>
		</div>
	</div >;
};
Settings.url = "/interactive/sky-games/settings";
export default Settings;
