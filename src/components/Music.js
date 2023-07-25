import React, { createContext, useContext, useEffect, useState } from "react";


const MusicContext = createContext();

function MusicProvider({ children, value = {} }) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTrack, setCurrentTrack] = useState("");
	const [volume, setVolume] = useState(1);
	const [muted, setMuted] = useState(false);
	const audioRef = React.createRef();

	useEffect(() => {
		if (currentTrack && audioRef.current) {
			if (audioRef.current.src !== currentTrack)
				audioRef.current.src = currentTrack;
			audioRef.current.volume = volume;
			audioRef.current.muted = muted;
			if (isPlaying)
				audioRef.current.play().catch(console.error);
			else
				audioRef.current.pause();
		} else {
			audioRef.current.pause();
			setIsPlaying(false);
		}
	}, [currentTrack, isPlaying, volume, muted, audioRef.current]);

	useEffect(() => {
		const play = () => {

			if (!currentTrack || isPlaying) return;
			audioRef.current.play().catch(error => {
				console.error("error");
			});
			setIsPlaying(true);
		};

		const interactions = ['mousedown', 'keydown', 'touchstart', 'gamepadconnected'];

		interactions.forEach(event => {
			document.addEventListener(event, play);
		});

		return (() => {
			interactions.forEach(event => {
				document.removeEventListener(event, play);
			});
			if (audioRef.current) {
				if (audioRef.current.pause) audioRef.current.pause();
				audioRef.current.currentTime = 0;
			}
		});
	});

	const changeTrack = (src) => {
		if (src !== currentTrack) {
			setCurrentTrack(src);
			setIsPlaying(true);
		} else {
			togglePlay();
		}
	};

	const togglePlay = () => {
		if (currentTrack)
			setIsPlaying(!isPlaying);
	};

	const changeVolume = vol => {
		audioRef.current.volume = vol;
		setVolume(vol);
	};
	const toggleMute = () => {
		setMuted(!muted);
	};

	Object.assign(value, { isPlaying, setIsPlaying, changeTrack, currentTrack, changeVolume, volume, toggleMute, muted });


	return (
		<MusicContext.Provider value={{ ...value }}>
			{children}
			<audio data-testid="page-music-audio" ref={audioRef} src={currentTrack} autoPlay={false} loop={true} />
		</MusicContext.Provider>
	);
};

function Music({ src }) {
	const { currentTrack, changeTrack } = useContext(MusicContext);


	useEffect(() => {
		if (src !== currentTrack) {
			changeTrack(src);
		}
	}, [changeTrack, src]);

	return null;
}

export { Music, MusicContext, MusicProvider };
