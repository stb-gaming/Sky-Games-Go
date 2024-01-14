import { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Music, MusicContext } from '../../components/Music';
import '../../scss/skyGames/main.scss';
import SkyGamesLogo from './components/SkyGamesLogo';
import createMenu from '../../utils/createMenu';
import getParentLocation from '../../utils/getParentLocation';
import Controls from './Controls';
import Settings from './Settings';
import SkyRemote from "../../userscripts/SkyRemote.user";
import calculateLastNext from '../../utils/calculateLastNext';
import TVGuide from '../opentv_epg/TVGuide';
import BoxOffice from '../opentv_epg/BoxOffice';
import Services from '../opentv_epg/Services';
import Interactive from '../opentv_epg/Interactive';
import games_local from '../../data/games.json';
import { SkyGamesLink, SkyGamesNavigate } from './components/SkyGamesLink';
const GRID_PAGE_LENGTH = 9;
const ALL_PAGE_LENGTH = 24;
const games_json = "https://stb-gaming.github.io/high-scores/games.json";

function SkyGamesTab({ label, href = "#", selected }) {
	return <SkyGamesLink to={href} className={(selected ? "active " : "") + "skyGamesTab"}>{label}</SkyGamesLink>;
}

function SkyGamesGame({ game, hideimg, img = game.image || game.splash || game.menu || game.gameplay || "SKY Games/nogame.png", href = game.url || "#", alt = game.title || href, onHover }) {
	return <SkyGamesLink to={href} className="skyGames_game" onFocus={onHover} onMouseEnter={onHover}>
		{img ?
			<img src={"/assets/img/games/" + img} alt={alt} />
			: alt}
	</SkyGamesLink>;
}

async function getGames() {
	try {

		const response = await fetch(games_json, {
			// mode: "cors",
			// headers: {
			// 	// 'Access-Control-Allow-Origin': 'sky-games.pages.dev',
			// 	'Content-Type': 'application/json',
			// 	'Accept': 'application/json'
			// }
		});

		console.log("from high scores");
		return await response.json();
	} catch (error) {

		console.log("from local");
		return games_local;
	}
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
		for (let arrow of arrows) {
			arrow.addEventListener("animationend", animationEnd);
		}
	}, []);

	return <>
		<SkyGamesLink to={SkyGames.url + "/" + last + (sort ? "/" + sort : "")} className="skyGamesArrowLeft" >
			<img src="/assets/img/skyGames/arrow.svg" alt="last page" />
		</SkyGamesLink>


		<SkyGamesLink to={SkyGames.url + "/" + next + (sort ? "/" + sort : "")} className="skyGamesArrowRight">
			<img src="/assets/img/skyGames/arrow.svg" alt="next page" />
		</SkyGamesLink></>;
}


function SkyGamesGamesList({ list = "0", sort, games, isPageLoaded }) {
	const [selectedGame, setSelectedGame] = useState({ title: "Choose a game", description: "Hover over a game to see details", image: "SKY Games/nogame.png" });
	const navigate = useNavigate();

	list = Number(list) || list;
	const [sortedGames, setSortedGames] = useState([]);
	const [filteredGames, setFilteredGames] = useState([]);
	const [lastList, setLastList] = useState(NaN);
	const [currentList, setCurrentList] = useState(NaN);
	const [menu] = useState(createMenu({ itemSelector: ".skyGames_game", animations: true, animationLength: 500 }));
	const [bindsSetup, setBindsSetup] = useState(false);

	useEffect(() => {
		if (sort) {
			let sorted = sortObjArr(games, sort);
			setSortedGames(sorted);
		} else {
			setSortedGames(games);
		}
	}, [sort, games]);

	useEffect(() => {
		if (typeof list === "number") {
			setCurrentList(list);
			//list is page number
			// All Games
			let offset = (list - 1) * ALL_PAGE_LENGTH;
			let filtered = sortedGames.slice(offset, offset + ALL_PAGE_LENGTH);
			setFilteredGames(filtered);
		} else {
			// named list
			let filtered = sortedGames.filter(game => game.list === list);

			if (list === "new") {
				setCurrentList(0);
				let newGameIndexes = sortObjArr(games, "archived", true).map((g, i) => i);
				filtered = sortedGames.filter((game, i) => newGameIndexes.includes(i));
			}
			filtered = filtered.slice(0, GRID_PAGE_LENGTH);
			if (list === "classics") {
				setCurrentList(1);
			}

			if (list === "family") {
				setCurrentList(2);
				filtered.splice(7, 1, {
					title: "All Games",
					description: "All available games to play",
					url: SkyGames.url + "/1"
				});

				filtered.splice(4, 1, {
					title: "STBG Discord",
					description: "Join the STB Gaming community on Discord!",
					image: "STB Gaming/DiscordTile.png",
					category: "STB Gaming",
					url: "https://discord.gg/qSB8nYDfBt"
				});
			}
			setFilteredGames(filtered);
		}

	}, [sortedGames, list, games]);



	useEffect(() => {
		let gameGrid = document.querySelector(".skyGames_gameGrid") || document.querySelector(".skyGames_allGames");
		if (!gameGrid) return;

		//console.log(lastList, currentList);

		menu.setPages([gameGrid], currentList - lastList);
	}, [filteredGames, menu, currentList, lastList]);


	useEffect(() => {
		if (bindsSetup) return;
		setBindsSetup(true);

		const removalParams =
			[
				...["up", "down", "left", "right"].map(direction => SkyRemote.onReleaseButton(direction, () => {  // arrow buttons
					menu[direction]();
				})),
				...Object.entries({ "up": "Left", "down": "Right" }).map(([pageKey, arrow]) =>
					SkyRemote.onReleaseButton(`channel-${pageKey}`, () => { // channel-up/channel-down for page switching
						document.querySelector(`.skyGamesArrow${arrow}`).click();
					})),
				SkyRemote.onReleaseButton("backup", () => {
					SkyGamesNavigate(getParentLocation(window.location.pathname), navigate);
				})
			];

		return () => {
			setBindsSetup(false);
			menu.clearTimeouts();
			for (const paramSet of removalParams) {
				SkyRemote.removeButtonEventListener(...paramSet);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [menu]);

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

		const { last, next } = calculateLastNext(list, tabs, Math.ceil(games.length / GRID_PAGE_LENGTH), 1);
		const lastLink = SkyGames.url + "/" + last + (sort ? "/" + sort : ""),
			nextLink = SkyGames.url + "/" + next + (sort ? "/" + sort : "");
		menu.setVerticality(false);
		menu.setOnPageChange(({ dp, pos }) => {
			setLastList(currentList);
			if (dp < 0) {//left
				SkyGamesNavigate(lastLink, navigate);
			}
			if (dp > 0) {//right
				SkyGamesNavigate(nextLink, navigate);
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
	else if (filteredGames.length <= ALL_PAGE_LENGTH) { // all games

		const { last, next } = calculateLastNext(list, null, Math.ceil(games.length / ALL_PAGE_LENGTH), 1);
		const lastLink = SkyGames.url + "/" + last + (sort ? "/" + sort : ""),
			nextLink = SkyGames.url + "/" + next + (sort ? "/" + sort : "");
		menu.setVerticality(true);

		menu.setOnPageChange(({ dp, pos }) => {
			setLastList(currentList);
			if (dp < 0) {//left
				SkyGamesNavigate(lastLink, navigate);
			}
			if (dp > 0) {//right
				SkyGamesNavigate(nextLink, navigate);
			}
		});

		return <>
			<div className="skyGames_gamesList">
				<div className="skyGames_allGames">
					{/* list of games here... */}
					{filteredGames.map((game, i) => <SkyGamesGame img={null} key={"game_" + i} onHover={() => {
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

function SkyGamesGameInfo({ game: newGameInfoGame }) {
	const [game, setGame] = useState({});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);

		const fadeGameInfo = setTimeout(() => {
			setLoading(false);
		}, 500);
		const changeGameInfo = setTimeout(() => {
			setGame(newGameInfoGame);
		}, 250);

		return () => {
			clearTimeout(changeGameInfo);
			clearTimeout(fadeGameInfo);
		};
	}, [newGameInfoGame]);

	let img = game.gameplay || game.image || game.splash || "SKY Games/nogame.png";
	return <div className={"gameInfo_infoEntry" + (loading ? " loading" : "")}>
		<img src={"/assets/img/games/" + img} className="skyGames_infoImage" alt={game.title} />
		<div className="infoEntry_gameText">
			<p className="gameText_title">{game.title}</p>
			<p className="gameText_blurb">{game.description}</p>
		</div>
		<span className="infoEntry_gameCategory">{game.category || "In your Game Pass ✓"}</span>
	</div>;
}

function SkyGamesFooter({ showColors }) {

	const { toggleMute } = useContext(MusicContext);

	if (showColors) {
		return <> <div className="skyGames_Footer">
			<div className="skyGames_footerContainerColors">
				<SkyGamesLink to={Controls.url} className="skyGames_colorRed">Controls</SkyGamesLink>
				<SkyGamesLink to={SkyGames.url + "/1"} className="skyGames_colorGreen">{"All Games"}</SkyGamesLink>
				<SkyGamesLink to="#" onClick={toggleMute} className="skyGames_colorYellow">Toggle Music</SkyGamesLink>
				<SkyGamesLink to={Settings.url} className="skyGames_colorBlue">Settings</SkyGamesLink>
			</div>
		</div></>;
	} else {
		return <> <div className="skyGames_footer">
			<div className="skyGames_footerContainer">
				<span className="skyGames_allGamesFooter">BACK UP to return</span>
			</div>
		</div> </>;
	}
}

const SkyGames = () => {
	const whiteFade = useRef();
	const params = useParams();
	const navigate = useNavigate();
	const { sort } = params;
	const [games, setGames] = useState([]);
	const [isPageLoaded, setIsPageLoaded] = useState(false);
	const [bindsSetup, setBindsSetup] = useState(false);
	const location = useLocation();
	let list = params.list ? params.list : "new";

	useEffect(() => {
		const fakePageLoadTimeout = setTimeout(() => {
			setIsPageLoaded(true);
		}, 500);

		getGames().then(setGames).catch(console.error);


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
			const buttonElem = document.querySelector(`.skyGames_color${capitalise(colour)}`);
			if (buttonElem !== null) {
				buttonElem.click();
			}
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

	let name = String(list).charAt(0).toUpperCase() + String(list).slice(1),
		pageTitle = "";
	if (!list || list === "0") {
		pageTitle = "The nothing list" + (sort ? `, sorted by ${sort}` : '');
	}
	if (Number(list)) {
		pageTitle = sort ? `Games sorted by ${sort}` : 'All Games, page ' + list;
	} else {
		pageTitle = name + (sort ? `, sorted by ${sort}` : '');
	}

	const isOnAllGames = () => {
		let numList;
		try {
			numList = Number(list);
		} catch (error) {
			return false;
		}
		return [...Array(games.length % GRID_PAGE_LENGTH).keys()].map(n => n + 1).includes(numList);
	};

	return <div className="skyGames">
		{/* <img src="/assets/img/reference.jpg" alt="reference" className="skyGames_reference" /> */}
		<Music src="/assets/music/sky-games.mp3" />
		<div className="skyGamesHeader">
			<SkyGamesLogo />
			{["new", "classics", "family"].includes(list) ?
				<div className="skyGamesTabs categoryGames">
					<SkyGamesTab label="New Games" selected={list === undefined || list === "new"} href={SkyGames.url + "/new"} />
					<SkyGamesTab label="Classics" selected={list === "classics"} href={SkyGames.url + "/classics"} />
					<SkyGamesTab label="Family Fun" selected={list === "family"} href={SkyGames.url + "/family"} />
					{/* <SkyGamesTab label="All" selected={list === "1"} href="/sky-games/1" /> */}
				</div>
				: <div className="skyGamesTabs allGames"><SkyGamesTab label={pageTitle} selected={true} href="#" /></div>}
		</div>
		<div className="skyGamesMain">
			<div id="skyGames_fade" className={`${isPageLoaded ? "done" : ""}`} ref={whiteFade} />
			<div className="skyGamesMainContainer split">
				<SkyGamesGamesList list={list} sort={sort} games={games} isPageLoaded={isPageLoaded} />
				{/* <div className="test"></div> */}
			</div>
		</div>
		<SkyGamesFooter showColors={!isOnAllGames()} />
	</div>;
};
SkyGames.url = "/interactive/sky-games";
export default SkyGames;
