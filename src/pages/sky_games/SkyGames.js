import '../../scss/skyGames/main.scss';

function SkyGamesLogo() {
	return <div className="skyGamesLogo"><img src="/assets/img/skyGames/skygames_logo.jpg" alt="Sky Games" /></div>;
}

function SkyGamesTab({ label, href, selected }) {
	return <a href={href} className={(selected ? "active " : "") + "skyGamesTab"}>{label}</a>;
}

function SkyGamesGame({ img, href = "#" }) {
	return <Link to={href} className="skyGames_game"><img src={img}></img></Link>
}

const SkyGames = () => {
	return <span className="skyGames">
		<div className="skyGamesHeader">
			<SkyGamesLogo />

			<div className="skyGamesTabs">
				<SkyGamesTab label="Hot Games" href="#" selected={true} />
				<SkyGamesTab label="Classics" href="#" />
				<SkyGamesTab label="Family Fun" href="#" />
			</div>
		</div>
		<div className="skyGamesMain">
			<div className="skyGames_gamesList">
				<img src="/assets/img/skyGames/arrow.svg" className="skyGamesArrowLeft" />
				<SkyGamesGame img="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8XFqF5rPgYotiGkYSpe7wji541p38z7OCRw&usqp=CAU" href="#"></SkyGamesGame>
				<SkyGamesGame img="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8XFqF5rPgYotiGkYSpe7wji541p38z7OCRw&usqp=CAU" href="#"></SkyGamesGame>
				<SkyGamesGame img="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8XFqF5rPgYotiGkYSpe7wji541p38z7OCRw&usqp=CAU" href="#"></SkyGamesGame>
				<SkyGamesGame img="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8XFqF5rPgYotiGkYSpe7wji541p38z7OCRw&usqp=CAU" href="#"></SkyGamesGame>
				<SkyGamesGame img="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8XFqF5rPgYotiGkYSpe7wji541p38z7OCRw&usqp=CAU" href="#"></SkyGamesGame>
				<SkyGamesGame img="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8XFqF5rPgYotiGkYSpe7wji541p38z7OCRw&usqp=CAU" href="#"></SkyGamesGame>
				<SkyGamesGame img="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8XFqF5rPgYotiGkYSpe7wji541p38z7OCRw&usqp=CAU" href="#"></SkyGamesGame>
				<SkyGamesGame img="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8XFqF5rPgYotiGkYSpe7wji541p38z7OCRw&usqp=CAU" href="#"></SkyGamesGame>
				<SkyGamesGame img="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8XFqF5rPgYotiGkYSpe7wji541p38z7OCRw&usqp=CAU" href="#"></SkyGamesGame>
				<img src="/assets/img/skyGames/arrow.svg" className="skyGamesArrowRight" />
			</div>
			<div className="skyGames_gameInfo">
				<div className="gameInfo_container">
					<img src="lorem" alt="" />
				</div>
			</div>
		</div>
	</span>;
};


export default SkyGames;
