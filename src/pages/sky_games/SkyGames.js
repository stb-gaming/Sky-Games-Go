import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Music, MusicContext } from '../../components/Music';
import '../../scss/skyGames/main.scss';

function SkyGamesLink({ children, to, ...rest }) {
	const navigate = useNavigate();

	const handleLinkClick = e => {
		e.preventDefault();
		const whiteFade = document.getElementById("skyGames_fade");

		if (whiteFade) {
			whiteFade.classList.remove("done");
			setTimeout(() => {
				// Check if the link is internal or external
				if (to.startsWith('/')) {
					// Internal link, use navigate
					navigate(to);
				} else {
					// External link, open in a new tab/window
					//window.open(to, '_blank');
					window.location.href = to;
				}
			}, 500);
		}
	};

	return (
		<a onClick={handleLinkClick} href={to} {...rest}>
			{children}
		</a>
	);
}

function SkyGamesLogo() {
	return <div className="skyGamesLogo"><img src="/assets/img/skyGames/skygames_logo.jpg" alt="Sky Games" /></div>;
}

function SkyGamesTab({ label, href = "#", selected }) {
	return <SkyGamesLink to={href} className={(selected ? "active " : "") + "skyGamesTab"}>{label}</SkyGamesLink>;
}

function SkyGamesGame({ game, img = game.image || game.splash || game.menu || game.gameplay, href = game.url || "#", alt = game.title || href }) {
	return <SkyGamesLink to={href} className="skyGames_game"><img src={"/assets/img/games/" + img} alt={alt}></img></SkyGamesLink>;
}


function SkyGamesGamesList({ list = "1", sort, games }) {

	const GRID_PAGE_LENGTH = 9;

	list = Number(list) || list;
	let allGames = games;

	if (sort) {
		let xor = (foo, bar) => (foo && !bar) || (!foo && bar);
		games = games.sort((a, b) => {
			let sorted = [a[sort], b[sort]].sort();
			if (xor(sorted[0] === b[sort], typeof a[sort] == "boolean" || typeof b[sort] == "boolean")) {
				return 1;
			} else {
				return -1;
			}
		});
	}

	console.log(list);

	if (typeof list == "number") {
		//list is page number
		// All Games
		let offset = (list - 1) * GRID_PAGE_LENGTH;
		games = allGames.slice(offset, offset + GRID_PAGE_LENGTH);
	} else {
		// named list
		//there is a named list to switch case (sort,new,classics,family)
		// and yes i think i will make the tabs be new, classics and family
		games = [];
	}

	if (!games.length) {
		let name = String(list).charAt(0).toUpperCase() + String(list).slice(1);
		if (!list || list === "0") {
			return <h1>There was an error when trying to {sort ? ` sorting nothing by ${sort}` : 'list nothing'}.</h1>;
		}
		if (typeof list == "number") {
			name = "page " + name;
		} else {
			name = "the " + name + " list";
		}
		; return <h1>There are no games in {name}{sort ? ` when sorted by ${sort}` : ''}. </h1>;
	}
	if (games.length <= GRID_PAGE_LENGTH) {
		let tabs = ["new", "classics", "family"];
		let last = 0;
		let next = 0;

		if (tabs.includes(list)) {
			let currentTab = tabs.indexOf(list);
			last = tabs[(currentTab - 1) % tabs.length];
			next = tabs[(currentTab + 1) % tabs.length];
		} else if (typeof list == "number") {
			let pageCount = Math.ceil(allGames.length / GRID_PAGE_LENGTH);
			const mod1 = (a, b) => ((a - 1 + b) % b) + 1;

			last = mod1(list - 1, pageCount);
			next = mod1(list + 1, pageCount);
		}

		return <div className="skyGames_gamesList">
			<SkyGamesLink to={"/sky-games/" + last + (sort ? "/" + sort : "")}>
				<img src="/assets/img/skyGames/arrow.svg" className="skyGamesArrowLeft" alt="last page" />
			</SkyGamesLink>


			<SkyGamesLink to={"/sky-games/" + next + (sort ? "/" + sort : "")}>
				<img src="/assets/img/skyGames/arrow.svg" className="skyGamesArrowRight" alt="next page" />
			</SkyGamesLink>
			<div className="skyGames_gameGrid">
				{games.map(game => <SkyGamesGame game={game} />)}
			</div>
		</div>;
	}

}

function SkyGamesGameInfo({ game }) {
	return <div className="gameInfo_infoEntry">
		<img src={game.gameplay || game.menu || game.splash || game.image || "https://static.wikia.nocookie.net/sky-gamestar/images/7/74/Sky_Games_05-2012.png"} className="skyGames_infoImage" />
		<div className="infoEntry_gameText">
			<p className="gameText_title">{game.name || "Sky Game"}</p>
			<p className="gameText_blurb">{game.description || "New to Sky Games!"}</p>
		</div>
	</div>;
}


const SkyGames = () => {
	const games = require("../../data/games.json");
	const whiteFade = useRef();
	const { list, sort } = useParams();
	const [isPageLoaded, setIsPageLoaded] = useState(false);
	const location = useLocation();

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
		}, 50);

		// Cleanup the timeout on unmount to avoid memory leaks
		return () => clearTimeout(fadeInTimeout);
	}, [location]);

	return <div className="skyGames">
		<Music src="/assets/music/sky-games.mp3" />
		<div className="skyGamesHeader">
			<SkyGamesLogo />
			{["new", "classics", "family"].includes(list) ?
				<div className="skyGamesTabs">
					<SkyGamesTab label="New Games" selected={list === undefined || list === "new"} href="/sky-games/new" />
					<SkyGamesTab label="Classics" selected={list === "classics"} href="/sky-games/classics" />
					<SkyGamesTab label="Family Fun" selected={list === "family"} href="/sky-games/family" />
					<SkyGamesTab label="All" selected={list === "1"} href="/sky-games/1" />
				</div>
				: null}

		</div>
		<div className="skyGamesMain">
			<div id="skyGames_fade" className={`${isPageLoaded ? "done" : ""}`} ref={whiteFade} />
			<SkyGamesGamesList list={list} sort={sort} games={games} />

			<div className="skyGames_gameInfo">
				<div className="gameInfo_container">
					<SkyGamesGameInfo game="Denki Blocks!" />
				</div>
			</div>
		</div>
	</div>;
};


export default SkyGames;
