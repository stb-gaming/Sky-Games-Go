import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './scss/main.scss'

import Layout from "./pages/Layout";
import TestPage from './pages/opentv_epg/TestPage'
import NotFound from './pages/errors/NotFound'
import TestPageMore from "./pages/opentv_epg/TestPageMore";

export default function App() {
  return (
    <div className="appContainer">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<TestPage />} />
          <Route path="more" element={<TestPageMore />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);