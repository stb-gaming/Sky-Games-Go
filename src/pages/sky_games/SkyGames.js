import '../../scss/skyGames/main.scss';

function SkyGamesLogo() {
	return <div className="skyGamesLogo"><img src="/assets/img/skyGames/skygames_logo.jpg" alt="Sky Games" /></div>;
}

function SkyGamesTab({ label, href }) {
	return <a href={href} class="skyGamesTab">{label}</a>;
}

const SkyGames = () => {
	return <span className="skyGames">
		<div className="skyGamesHeader">
			<SkyGamesLogo />

			<div className="skyGamesTabs">
				<SkyGamesTab label="Hot Games" href="#" />
				<SkyGamesTab label="Classics" href="#" />
				<SkyGamesTab label="Family Fun" href="#" />
			</div>
		</div>;
		<h1>Hello</h1>
	</span>;
};


export default SkyGames;
