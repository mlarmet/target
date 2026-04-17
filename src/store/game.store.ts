import { create } from "zustand";

type GameState = {
	mode: GameMode;
	players: PlayerData[];

	turn: number;

	setMode: (mode: GameMode) => void;
	setPlayers: (players: PlayerData[]) => void;

	setTurn: (turn: number) => void;
};

const NEW_PLAYER: PlayerData = { name: "Maxence", dartCount: 0, score: [] };

export const useGameStore = create<GameState>((set) => ({
	mode: "501",
	players: [NEW_PLAYER, NEW_PLAYER, NEW_PLAYER],

	turn: 0,

	setMode: (mode: GameMode) => set({ mode }),
	setPlayers: (players: PlayerData[]) => set({ players }),

	setTurn: (turn: number) => set({ turn }),
}));
