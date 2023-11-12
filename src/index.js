import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './scss/main.scss';

import TVGuide from './pages/opentv_epg/TVGuide';
import TVGuideMore from "./pages/opentv_epg/TVGuideMore";
import BoxOffice from "./pages/opentv_epg/BoxOffice";
import SkyGames from './pages/sky_games/SkyGames';
import Controls from './pages/sky_games/Controls';
import Settings from './pages/sky_games/Settings';
import Page404 from "./pages/opentv_epg/404";
import Interactive from "./pages/opentv_epg/Interactive";
import { MusicProvider } from "./components/Music";
import Services from "./pages/opentv_epg/Services";
import SoundSettings from "./pages/opentv_epg/SoundSettings";
import SystemSetup from "./pages/opentv_epg/SystemSetup";
import SystemDetails from "./pages/opentv_epg/SystemDetails";
import ThemeTest from "./pages/theme_test/theme";
import { initControllerBinds, cleanupControllerBinds } from './userscripts/GamepadSupport.user';
import { useEffect } from 'react';

export default function App() {

	useEffect(() => {
		initControllerBinds();

		return () => {
			cleanupControllerBinds();
		};
	}, []);


	return (
		<div className="appContainer">
			<MusicProvider>
				<BrowserRouter>
					<Routes>
						<Route index exact path="/" element={<TVGuide />} />
						<Route path={TVGuide.url} element={<TVGuide />} />
						<Route path={TVGuideMore.url} element={<TVGuideMore />} />
						<Route path={BoxOffice.url} element={<BoxOffice />} />
						<Route path={Services.url} element={<Services />} />
						<Route path={SystemSetup.url} element={<SystemSetup />} />
						<Route path={SystemDetails.url} element={<SystemDetails />} />
						<Route path={SoundSettings.url} element={<SoundSettings />} />
						<Route path={Interactive.url} element={<Interactive />} />
						<Route path={Controls.url} element={<Controls />} />
						<Route path={Settings.url} element={<Settings />} />
						<Route path={SkyGames.url + "/:list?/:sort?"} element={<SkyGames />} />
						<Route path={ThemeTest.url} element={<ThemeTest />} />
						<Route path="*" element={<Page404 />} />
					</Routes>
				</BrowserRouter>
			</MusicProvider>
		</div>
	);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
