import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './scss/main.scss';

import Layout from "./pages/Layout";
import TestPage from './pages/opentv_epg/TestPage';
import TestPageMore from "./pages/opentv_epg/TestPageMore";
import SkyGames from './pages/sky_games/SkyGames';
import Page404 from "./pages/opentv_epg/404";
import Interactive from "./pages/opentv_epg/Interactive";

export default function App() {
	return (
		<div className="appContainer">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route index element={<TestPage />} />
						<Route path="/interactive" element={<Interactive />} />
						<Route path="more" element={<TestPageMore />} />
						<Route path="/sky-games" element={<SkyGames />} />
						<Route path="*" element={<Page404 />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
