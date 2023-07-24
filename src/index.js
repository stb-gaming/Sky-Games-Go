import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './scss/main.scss';

import TestPage from './pages/opentv_epg/TestPage';
import TestPageMore from "./pages/opentv_epg/TestPageMore";
import SkyGames from './pages/sky_games/SkyGames';
import Controls from './pages/sky_games/Controls';
import Page404 from "./pages/opentv_epg/404";
import Interactive from "./pages/opentv_epg/Interactive";
import { MusicProvider } from "./components/Music";
import { useEffect } from "react";
import { initUserscripts } from "./userscripts";

export default function App() {

	useEffect(() => {
		initUserscripts(window);
	});

	return (
		<div className="appContainer">
			<MusicProvider>
				<BrowserRouter>
					<Routes>
						<Route index exact path="/" element={<TestPage />} />
						<Route path="/interactive" element={<Interactive />} />
						<Route path="/more" element={<TestPageMore />} />
						<Route path="/sky-games/controls" element={<Controls />} />
						<Route path="/sky-games/:list?/:sort?" element={<SkyGames />} />
						<Route path="*" element={<Page404 />} />
					</Routes>
				</BrowserRouter>
			</MusicProvider>
		</div>
	);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
