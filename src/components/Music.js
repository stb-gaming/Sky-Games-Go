import React, { createContext, useContext, useEffect, useState } from "react";
import storage from "../utils/storage";


const MusicContext = createContext();

function MusicProvider({ children, value = {} }) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTrack, setCurrentTrack] = useState("");
	const [volume, setVolume] = useState(1);
	const [muted, setMuted] = useState(false);
	const audioRef = React.createRef();

	useEffect(() => {
		const soundSettings = storage.getItem('soundSettings') || {};
		setVolume(Number(soundSettings.volume) || 1);
		setMuted(soundSettings.muted || false);
	}, []);

	useEffect(() => {
		let audioRefCurrent = audioRef.current;
		if (currentTrack && audioRefCurrent) {
			if (audioRef.current.src !== currentTrack)
				audioRef.current.src = currentTrack;
			audioRefCurrent.volume = volume;
			audioRefCurrent.muted = muted;
			if (audioRefCurrent.paused === isPlaying) {
				if (isPlaying)
					audioRefCurrent.play().catch(console.error);
				else
					audioRefCurrent.pause();
			}
		} else {
			audioRefCurrent.pause();
			setIsPlaying(false);
		}
	}, [currentTrack, isPlaying, volume, muted, audioRef]);

	useEffect(() => {
		let audioRefCurrent = audioRef.current;
		const play = () => {

			if (!currentTrack || isPlaying) return;
			audioRefCurrent.play().catch(error => {
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
			if (audioRefCurrent) {
				if (audioRefCurrent.pause) audioRefCurrent.pause();
				audioRefCurrent.currentTime = 0;
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
	const changeMute = (val) => {
		setMuted(val);
	};

	Object.assign(value, { isPlaying, setIsPlaying, changeTrack, currentTrack, changeVolume, volume, toggleMute, muted, changeMute });


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
	}, [changeTrack, src, currentTrack],);

	return null;
}

export { Music, MusicContext, MusicProvider };
