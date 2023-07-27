import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './scss/main.scss';

import TVGuide from './pages/opentv_epg/TVGuide';
import TVGuideMore from "./pages/opentv_epg/TVGuideMore";
import SkyGames from './pages/sky_games/SkyGames';
import Controls from './pages/sky_games/Controls';
import Settings from './pages/sky_games/Settings';
import Page404 from "./pages/opentv_epg/404";
import Interactive from "./pages/opentv_epg/Interactive";
import { MusicProvider } from "./components/Music";
import { useEffect } from "react";
import { initUserscripts } from "./userscripts";
import Services from "./pages/opentv_epg/Services";
import SoundSettings from "./pages/opentv_epg/TestPageSound";
import SystemSettings from "./pages/opentv_epg/SystemSettings";
import SystemDetails from "./pages/opentv_epg/SystemDetails";

export default function App() {

	useEffect(() => {
		initUserscripts(window);
	});

	return (
		<div className="appContainer">
			<MusicProvider>
				<BrowserRouter>
					<Routes>
						<Route index exact path="/" element={<TVGuide />} />
						<Route path={TVGuide.url} element={<TVGuide />} />
						<Route path={TVGuideMore.url} element={<TVGuideMore />} />
						<Route path={Services.url} element={<Services />} />
						<Route path={SystemSettings.url} element={<SystemSettings />} />
						<Route path={SystemDetails.url} element={<SystemDetails />} />
						<Route path={SoundSettings.url} element={<SoundSettings />} />
						<Route path={Interactive.url} element={<Interactive />} />
						<Route path={Controls.url} element={<Controls />} />
						<Route path={Settings.url} element={<Settings />} />
						<Route path={SkyGames.url + "/:list?/:sort?"} element={<SkyGames />} />
						<Route path="*" element={<Page404 />} />
					</Routes>
				</BrowserRouter>
			</MusicProvider>
		</div>
	);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
