import { Music, MusicContext } from '../../components/Music';
import '../../scss/skyGames/main.scss';
import { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import SkyGamesLink from './components/SkyGamesLink.js';
import SkyGamesLogo from './components/SkyGamesLogo';
import SkyGames from './SkyGames';
import Controls from './Controls';
import TVGuide from '../opentv_epg/TVGuide';
import BoxOffice from '../opentv_epg/BoxOffice';
import Services from '../opentv_epg/Services';
import Interactive from '../opentv_epg/Interactive';
import SkyRemote from '../../userscripts/SkyRemote.user';

const capitalise = text =>
	text.split(" ").map(word =>
		word.charAt(0).toUpperCase() + word.slice(1)
	).join(" ");

const Settings = () => {
	const whiteFade = useRef();
	const navigate = useNavigate();
	const [isPageLoaded, setIsPageLoaded] = useState(false);
	const [bindsSetup, setBindsSetup] = useState(false);
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

	useEffect(() => {
		if (!isPageLoaded || bindsSetup) return;
		setBindsSetup(true);

		const removalParams = ["red", "green", "yellow", "blue"].map(colour => SkyRemote.onReleaseButton(colour, () => {
			document.querySelector(`.skyGames_color${capitalise(colour)}`).click();
		}));
		return () => {
			for (const paramSet of removalParams) {
				SkyRemote.removeButtonEventListener(...paramSet);
			}
			setBindsSetup(false);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isPageLoaded]);

	useEffect(() => {

		const removalParams = [
			SkyRemote.onReleaseButton("tv-guide", () => {
				navigate(TVGuide.url);
			}),
			SkyRemote.onReleaseButton("box-office", () => {
				navigate(BoxOffice.url);
			}),
			SkyRemote.onReleaseButton("services", () => {
				navigate(Services.url);
			}),
			SkyRemote.onReleaseButton("interactive", () => {
				navigate(Interactive.url);
			})
		];

		return () => {
			for (const paramSet of removalParams) {
				SkyRemote.removeButtonEventListener(...paramSet);
			}
		};
	});

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
					<li><Link to="/userscripts/SkyRemote.user.js">Sky Remote API</Link></li>
					<li><Link to="/userscripts/GamepadSupport.user.js">Gamepad Support</Link></li>
					<li><Link to="/userscripts/SkyRemoteMobile.user.js">Mobile Touchpad</Link></li>
					<li><Link to="/userscripts/BeehiveBedlam.user.js">Beehive Bedlam Helper</Link></li>
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
