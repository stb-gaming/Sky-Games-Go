import { render, screen } from "@testing-library/react";
import { Music, MusicProvider } from "./Music";
import "@testing-library/jest-dom/extend-expect";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import { act } from "react-dom/test-utils";


HTMLMediaElement.prototype.pause = jest.fn();
HTMLMediaElement.prototype.play = () => {
	return { catch: jest.fn() };
};

describe("Testing <MusicProvider> and <Music>", () => {

	it("Renders <MusicProvider> without any errors and correctly creates the <audio> element.", () => {
		render(
			<MusicProvider >
				<p>Hello World</p>
			</MusicProvider>
		);

		const audioElement = screen.getByTestId("page-music-audio");
		expect(audioElement).toBeInTheDocument();
	});

	it("Renders <Music> correctly by setting <audio>'s 'src' to the correct track", async () => {
		const testTrack = "example.mp3";
		render(
			<MusicProvider >
				<Music src={testTrack} />
			</MusicProvider >
		);

		const audioElement = screen.getByTestId("page-music-audio");
		expect(audioElement).toBeInTheDocument();
		expect(audioElement.src).toContain(testTrack);
	});



	it("Changes track when a new <Music> element is rendered", async () => {
		const testTrack = "test1.mp3",
			testTrack2 = "test2.mp3";
		render(
			<MusicProvider >
				<MemoryRouter initialEntries={[{ pathname: "/page1" }]}>
					<Routes>
						<Route path="/page1" element={<>
							<Music src={testTrack} />
							<Link to="/page2">Page 2</Link>
						</>} />
						<Route path="/page2" element={<Music src={testTrack2} />} />
					</Routes>
				</MemoryRouter>
			</MusicProvider >
		);
		const audioElement = screen.getByTestId("page-music-audio");
		expect(audioElement).toBeInTheDocument();
		expect(audioElement.src).toContain(testTrack);

		act(() => {
			screen.getByText("Page 2").click();
		});

		const audioElement2 = screen.getByTestId("page-music-audio");
		expect(audioElement2.src).toContain(testTrack2);
	});

	it("Test of musicContext.changeVolume()", async () => {
		const currentTrack = "example.mp3",
			volume = Math.random(),
			musicContext = {};
		render(
			<MusicProvider value={musicContext}>
				<Music src={currentTrack} />
			</MusicProvider >
		);

		const audioElement = screen.getByTestId("page-music-audio");
		expect(audioElement).toBeInTheDocument();
		expect(audioElement.src).toContain(currentTrack);

		const { changeVolume } = musicContext;
		act(() => {
			changeVolume(volume);
		});

		expect(audioElement.volume).toBe(volume);
	});



});
