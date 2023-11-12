import { useNavigate } from "react-router-dom";

function SkyGamesNavigate(to, navigate) {
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
}


function SkyGamesLink({ children, to, ...rest }) {
	const navigate = useNavigate();

	const handleLinkClick = rest.onClick || (e => {
		SkyGamesNavigate(to, navigate);
	});

	return (
		<a onClick={handleLinkClick} href={to} {...rest}>
			{children}
		</a>
	);
}

export { SkyGamesLink, SkyGamesNavigate };
