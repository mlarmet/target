import { create } from "zustand";

type GameState = {
	mode: GameMode;
	players: PlayerData[];

	turn: number;

	currentPlayer: PlayerData | null;

	setCurrentPlayer: (player: PlayerData) => void;

	setMode: (mode: GameMode) => void;
	setPlayers: (players: PlayerData[]) => void;

	setTurn: (turn: number) => void;
};

const NEW_PLAYER = { name: "", score: [] };

const defaultPlayers = [NEW_PLAYER, NEW_PLAYER];

export const useGameStore = create<GameState>((set) => ({
	mode: 501,
	players: structuredClone(defaultPlayers),

	turn: 1,

	status: "idle",

	currentPlayer: null,

	setCurrentPlayer: (player: PlayerData) => set({ currentPlayer: player }),

	setMode: (mode: GameMode) => set({ mode }),
	setPlayers: (players: PlayerData[]) => set({ players }),

	setTurn: (turn: number) => set({ turn }),
}));
