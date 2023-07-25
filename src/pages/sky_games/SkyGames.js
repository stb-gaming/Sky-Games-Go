import { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Music, MusicContext } from '../../components/Music';
import '../../scss/skyGames/main.scss';
import SkyGamesLink from './components/SkyGamesLink.js';
import SkyGamesLogo from './components/SkyGamesLogo';
import createMenu from '../../utils/createMenu';


function SkyGamesTab({ label, href = "#", selected }) {
	return <SkyGamesLink to={href} className={(selected ? "active " : "") + "skyGamesTab"}>{label}</SkyGamesLink>;
}

function SkyGamesGame({ game, img = game.image || game.splash || game.menu || game.gameplay || "SKY Games/nogame.png", href = game.url || "#", alt = game.title || href, onHover }) {
	return <SkyGamesLink to={href} className="skyGames_game" onFocus={onHover} onMouseEnter={onHover}><img src={"/assets/img/games/" + img} alt={alt}></img></SkyGamesLink>;
}



const capitalise = text =>
	text.split(" ").map(word =>
		word.charAt(0).toUpperCase() + word.slice(1)
	).join(" ");

function sortObjArr(arr, prop, reverse) {
	let xor = (foo, bar) => (foo && !bar) || (!foo && bar);
	return arr.sort((a, b) => {
		let sorted = [a[prop], b[prop]].sort();
		if (xor(sorted[0] === b[prop], typeof a[prop] === "boolean" || typeof b[prop] === "boolean")) {
			return reverse ? -1 : 1;
		} else {
			return reverse ? 1 : -1;
		}
	});
}

function MovingArrows({ last, next, sort }) {

	const animationEnd = e => {
		e.target.style.animation = "none";
		setTimeout(() => {
			e.target.style.animation = "arrowMovement 0.5s 5";
		}, 10000);
	};

	useEffect(() => {
		let arrows = Array.from(document.querySelectorAll("[class^='skyGamesArrow']"));
		console.log(arrows);
		for (let arrow of arrows) {
			arrow.addEventListener("animationend", animationEnd);
		}
	}, []);

	return <>
		<SkyGamesLink to={"/sky-games/" + last + (sort ? "/" + sort : "")} className="skyGamesArrowLeft" >
			<img src="/assets/img/skyGames/arrow.svg" alt="last page" />
		</SkyGamesLink>


		<SkyGamesLink to={"/sky-games/" + next + (sort ? "/" + sort : "")} className="skyGamesArrowRight">
			<img src="/assets/img/skyGames/arrow.svg" alt="next page" />
		</SkyGamesLink></>;
}


function SkyGamesGamesList({ list = "0", sort, games, isPageLoaded }) {
	const [selectedGame, setSelectedGame] = useState({ title: "Choose a game", description: "Hover over a game to see details", image: "SKY Games/nogame.png" });
	const GRID_PAGE_LENGTH = 9;

	list = Number(list) || list;
	const [sortedGames, setSortedGames] = useState([]);
	const [filteredGames, setFilteredGames] = useState([]);
	const [menu] = useState(createMenu({ itemSelector: ".skyGames_game" }));
	const [bindsSetup, setBindsSetup] = useState(false);

	useEffect(() => {
		if (sort) {
			let sorted = sortObjArr(games, sort);
			console.log(sorted);
			setSortedGames(sorted);
		} else {
			setSortedGames(games);
		}
	}, [sort, games]);

	useEffect(() => {
		if (typeof list === "number") {
			//list is page number
			// All Games
			let offset = (list - 1) * GRID_PAGE_LENGTH;
			let filtered = sortedGames.slice(offset, offset + GRID_PAGE_LENGTH);
			setFilteredGames(filtered);
		} else {
			// named list
			let filtered = sortedGames.filter(game => game.list === list);

			if (list === "new") {
				let newGameIndexes = sortObjArr(games, "archived", true).map((g, i) => i);
				filtered = sortedGames.filter((game, i) => newGameIndexes.includes(i));
			}
			filtered = filtered.slice(0, GRID_PAGE_LENGTH);

			if (list === "family") {
				filtered.splice(7, 1, {
					title: "All Games",
					description: "Yes all games",
					url: "/sky-games/1"
				});
			}
			setFilteredGames(filtered);
		}

	}, [sortedGames, list, games]);



	useEffect(() => {
		//if (filteredGames.length) setSelectedGame(filteredGames[Math.floor(Math.random() * filteredGames.length)]);

		let gameGrid = document.querySelector(".skyGames_gameGrid");
		if (!gameGrid) return;
		menu.setPages([gameGrid]);
		//menu.goto(menu.getItem({ x: 1, y: 1 }));
		console.log("updated menu");
	}, [filteredGames, menu]);

	useEffect(() => {

		if (bindsSetup) return;
		document.addEventListener("userscriptsLoaded", ({ detail: { SkyRemote } }) => {
			if (bindsSetup) return;
			setBindsSetup(true);

			for (const direction of ["up", "down", "left", "right"]) {
				SkyRemote.onReleaseButton(direction, () => {
					console.log(direction);
					menu[direction]();
				});
			}


		});
	});


	if (!filteredGames.length) {
		let name = String(list).charAt(0).toUpperCase() + String(list).slice(1);
		if (!list || list === "0") {
			return <h1>There was an error when trying to {sort ? ` sort nothing by ${sort}` : 'list nothing'}.</h1>;
		}
		if (Number(list)) {
			name = "page " + name;
		} else {
			name = "the " + name + " list";
		}
		; return <h1>There are no games in {name}{sort ? ` when sorted by ${sort}` : ''}. </h1>;
	}

	if (filteredGames.length <= GRID_PAGE_LENGTH) {
		let tabs = ["new", "classics", "family"];
		let last = 0;
		let next = 0;

		if (tabs.includes(list)) {
			let currentTab = tabs.indexOf(list);
			last = tabs[(currentTab - 1 + tabs.length) % tabs.length];
			next = tabs[(currentTab + 1) % tabs.length];
		} else if (typeof list === "number") {
			let pageCount = Math.ceil(games.length / GRID_PAGE_LENGTH);
			const mod1 = (a, b) => ((a - 1 + b) % b) + 1;

			last = mod1(list - 1, pageCount);
			next = mod1(list + 1, pageCount);
		}

		menu.setOnPageChange(({ dp, pos }) => {
			if (dp < 0) {//left
				document.querySelector(".skyGamesArrowLeft").click();
			}
			if (dp > 0) {//right
				document.querySelector(".skyGamesArrowRight").click();
			}
		});


		return <> <div className="skyGames_gamesList">
			<MovingArrows last={last} next={next} sort={sort} />
			<div className="skyGames_gameGrid">
				{filteredGames.map((game, i) => <SkyGamesGame key={"game_" + i} onHover={() => {
					setSelectedGame(game);
				}} game={game} />)}
			</div>
		</div>
			<div className="skyGames_gameInfo">
				<div className="gameInfo_container">
					<SkyGamesGameInfo game={selectedGame} />
				</div>
			</div>
		</>;
	}
	else {
		return <h1>Cannot show more than {GRID_PAGE_LENGTH} games at a time yet.</h1>;
	}

}

function SkyGamesGameInfo({ game }) {
	//HERE
	let img = game.gameplay || game.image || game.splash || "SKY Games/nogame.png";
	return <div className="gameInfo_infoEntry">
		<img src={"/assets/img/games/" + img} className="skyGames_infoImage" alt={game.title} />
		<div className="infoEntry_gameText">
			<p className="gameText_title">{game.title}</p>
			<p className="gameText_blurb">{game.description}</p>
		</div>
		<span className="infoEntry_gameCategory">{game.category || "In your Game Pass ✓"}</span>
	</div>;
}


const SkyGames = () => {
	const games = require("../../data/games.json");
	const whiteFade = useRef();
	const params = useParams();
	const { sort } = params;
	const [isPageLoaded, setIsPageLoaded] = useState(false);
	const [bindsSetup, setBindsSetup] = useState(false);
	const location = useLocation();
	const { toggleMute } = useContext(MusicContext);
	let list = params.list ? params.list : "new";

	useEffect(() => {
		const fakePageLoadTimeout = setTimeout(() => {
			setIsPageLoaded(true);
		}, 500);

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
		if (!isPageLoaded || bindsSetup || !window.SkyRemote) return;
		setBindsSetup(true);
		const { SkyRemote } = window;
		["red", "green", "yellow", "blue"].forEach(colour => {
			SkyRemote.onReleaseButton(colour, () => {
				document.querySelector(`.skyGames_color${capitalise(colour)}`);
			});
		});

		SkyRemote.onReleaseButton("red", () => {
			document.querySelector(".skyGames_colorRed").click();
		});
		SkyRemote.onReleaseButton("green", () => {
			document.querySelector(".skyGames_colorGreen").click();
		});
		SkyRemote.onReleaseButton("yellow", () => {
			document.querySelector(".skyGames_colorYellow").click();
		});
		SkyRemote.onReleaseButton("blue", () => {
			document.querySelector(".skyGames_colorBlue").click();
		});
	}, [isPageLoaded, bindsSetup]);



	let name = String(list).charAt(0).toUpperCase() + String(list).slice(1),
		pageTitle = "";
	if (!list || list === "0") {
		pageTitle = "The nothing list" + (sort ? `, sorted by ${sort}` : '');
	}
	if (Number(list)) {
		pageTitle = sort ? `Games sorted by ${sort}` : 'All games, page ' + list;
	} else {
		pageTitle = name + (sort ? `, sorted by ${sort}` : '');
	}

	return <div className="skyGames">
		{/* <img src="/assets/img/reference.jpg" alt="reference" className="skyGames_reference" /> */}
		<Music src="/assets/music/sky-games.mp3" />
		<div className="skyGamesHeader">
			<SkyGamesLogo />
			{["new", "classics", "family"].includes(list) ?
				<div className="skyGamesTabs">
					<SkyGamesTab label="New Games" selected={list === undefined || list === "new"} href="/sky-games/new" />
					<SkyGamesTab label="Classics" selected={list === "classics"} href="/sky-games/classics" />
					<SkyGamesTab label="Family Fun" selected={list === "family"} href="/sky-games/family" />
					{/* <SkyGamesTab label="All" selected={list === "1"} href="/sky-games/1" /> */}
				</div>
				: <h1>{pageTitle}</h1>}
		</div>
		<div className="skyGamesMain">
			<div id="skyGames_fade" className={`${isPageLoaded ? "done" : ""}`} ref={whiteFade} />
			<div className="skyGamesMainContainer split">

				<SkyGamesGamesList list={list} sort={sort} games={games} isPageLoaded={isPageLoaded} />
				{/* <div className="test"></div> */}


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


export default SkyGames;
