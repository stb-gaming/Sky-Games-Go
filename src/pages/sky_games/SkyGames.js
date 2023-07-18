import '../../scss/skyGames/main.scss';

function SkyGamesLogo() {
	return <div className="skyGamesLogo"><img src="/assets/img/skyGames/skygames_logo.jpg" alt="Sky Games" /></div>;
}

function SkyGamesTab({ label, href, selected }) {
	return <a href={href} className={(selected ? "active " : "") + "skyGamesTab"}>{label}</a>;
}

function SkyGamesGame({ img, href = "#" }) {

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
