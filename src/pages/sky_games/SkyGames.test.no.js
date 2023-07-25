

describe("Tests te sky games page", () => {

	jest.mock("../../data/games.json", () => [
		{
			name: "Game 1",
			image: "game1.png",
			url: "/game1"
		},
		{
			name: "Game 2",
			image: "game2.png",
			url: "/game2"
		},
		{
			name: "Game 2",
			image: "game2.png",
			url: "/game1"
		}
	]);

});
