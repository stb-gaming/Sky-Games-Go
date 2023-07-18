import { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Music, MusicContext } from '../../components/Music';
import '../../scss/skyGames/main.scss';

function SkyGamesLogo() {
	return <div className="skyGamesLogo"><img src="/assets/img/skyGames/skygames_logo.jpg" alt="Sky Games" /></div>;
}

function SkyGamesTab({ label, href = "#", selected }) {
	return <Link to={href} className={(selected ? "active " : "") + "skyGamesTab"}>{label}</Link>;
}

function SkyGamesGame({ game, img = game.image || game.splash || game.menu || game.gameplay, href = game.url || "#", alt = game.title || href }) {
	return <Link to={href} className="skyGames_game"><img src={"/assets/img/games/" + img} alt={alt}></img></Link>;
}


function SkyGamesGamesList({ list = "1", sort, games }) {

	list = Number(list) || list;
	let allGames = games;

	if (sort) {
		let xor = (foo, bar) => (foo && !bar) || (!foo && bar);
		games = games.sort((a, b) => {
			let sorted = [a[sort], b[sort]].sort();
			if (xor(sorted[0] == b[sort], typeof a[sort] == "boolean" || typeof b[sort] == "boolean")) {
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
		let offset = (list - 1) * 9;
		games = allGames.slice(offset, offset + 9);
	} else {
		// named list
		//there is a named list to switch case (sort,new,classics,family)
		// and yes i think i will make the tabs be new, classics and family
		games = [];
	}

	if (!games.length) {
		return <h1>There are no games in {String(list).charAt(0).toUpperCase() + String(list).slice(1)} list{sort ? ` when sorted by ${sort}` : ''}. </h1>;
	}
	if (games.length <= 9) {
		let tabs = ["new", "classics", "family"], currentTab = tabs.indexOf(list);
		return <div className="skyGames_gamesList">
			{typeof list == "number" ? <>
				{list > 1 ?
					<Link to={"/sky-games/" + (list - 1) + (sort ? "/" + sort : "")}>
						<img src="/assets/img/skyGames/arrow.svg" className="skyGamesArrowLeft" />
					</Link>
					: null}


				{list < Math.ceil(allGames.length / 9) ?
					<Link to={"/sky-games/" + (list + 1) + (sort ? "/" + sort : "")}>
						<img src="/assets/img/skyGames/arrow.svg" className="skyGamesArrowRight" />
					</Link>
					: null}
			</>
				: <>
					{currentTab > 0 ?
						<Link to={"/sky-games/" + tabs[currentTab - 1] + (sort ? "/" + sort : "")}>
							<img src="/assets/img/skyGames/arrow.svg" className="skyGamesArrowLeft" />
						</Link>
						: null}


					{currentTab >= 0 && currentTab < tabs.length - 1 ?
						<Link to={"/sky-games/" + tabs[currentTab + 1] + (sort ? "/" + sort : "")}>
							<img src="/assets/img/skyGames/arrow.svg" className="skyGamesArrowRight" />
						</Link>
						: null}
				</>}

			<div className="skyGames_gameGrid">
				{games.map(game => <SkyGamesGame game={game} />)}
			</div>
		</div>;
	}

}


const SkyGames = () => {
	const { volume, changeVolume } = useContext(MusicContext);
	let games = require("../../data/games.json");
	let { list, sort } = useParams();
	console.log({ list, sort });

	console.log(games);

	return <span className="skyGames">
		<Music src="/assets/music/sky-games.mp3" />
		<div className="skyGamesHeader">
			<SkyGamesLogo />
			{["new", "classics", "family"].includes(list) ?
				<div className="skyGamesTabs">
					<SkyGamesTab label="New Games" selected={list == "new"} href="/sky-games/new" />
					<SkyGamesTab label="Classics" selected={list == "classics"} href="/sky-games/classics" />
					<SkyGamesTab label="Family Fun" selected={list == "family"} href="/sky-games/family" />
				</div>
				: null}

		</div>
		<div className="skyGamesMain">
			<SkyGamesGamesList list={list} sort={sort} games={games} />

			<div className="skyGames_gameInfo">
				<div className="gameInfo_container">
					<img src="lorem" alt="" />
				</div>
			</div>
		</div>
	</span>;
};


export default SkyGames;
