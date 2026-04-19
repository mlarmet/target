import { create } from "zustand";

type GameState = {
	mode: GameMode;
	players: PlayerData[];

	turn: number;

	currentPlayer: string;

	setCurrentPlayer: (name: string) => void;

	setMode: (mode: GameMode) => void;
	setPlayers: (players: PlayerData[]) => void;

	setTurn: (turn: number) => void;
};

const NEW_PLAYER: PlayerData = {
	name: "Maxence1",
	score: {
		0: [
			{ value: 20, multiplier: 1 },
			{ value: 20, multiplier: 2 },
			{ value: 20, multiplier: 3 },
		],
	},
};
const NEW_PLAYER_2: PlayerData = { name: "Maxence2", score: {} };
const NEW_PLAYER_3: PlayerData = { name: "Maxence3", score: {} };

export const useGameStore = create<GameState>((set) => ({
	mode: "501",
	players: [NEW_PLAYER, NEW_PLAYER_2, NEW_PLAYER_3],

	currentPlayer: "Maxence1",

	turn: 1,

	setCurrentPlayer: (name: string) => set({ currentPlayer: name }),

	setMode: (mode: GameMode) => set({ mode }),
	setPlayers: (players: PlayerData[]) => set({ players }),

	setTurn: (turn: number) => set({ turn }),
}));
