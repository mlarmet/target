import { create } from "zustand";

type GameState = {
	mode: GameMode;
	players: PlayerData[];

	turn: number;

	status: GameStatus;

	currentPlayer: PlayerData | null;

	history: GameSnapshot[];
	pushHistory: () => void;
	undo: () => void;

	setCurrentPlayer: (player: PlayerData) => void;

	setMode: (mode: GameMode) => void;
	setPlayers: (players: PlayerData[]) => void;

	setTurn: (turn: number) => void;

	setGameStatus: (status: GameStatus) => void;
};

const NEW_PLAYER = { name: "", score: [] };

const defaultPlayers = [NEW_PLAYER, NEW_PLAYER];

export const useGameStore = create<GameState>((set, get) => ({
	mode: 501,
	players: structuredClone(defaultPlayers),

	turn: 1,

	status: "idle",

	currentPlayer: null,

	history: [],
	pushHistory: () => {
		const { players, currentPlayer, turn } = get();
		// Deep copy pour éviter les mutations
		set((s) => ({
			history: [
				...s.history,
				{
					players: structuredClone(players),
					currentPlayer: currentPlayer ? structuredClone(currentPlayer) : null,
					turn,
				},
			],
		}));
	},

	undo: () => {
		const { history } = get();
		if (!history.length) return;
		const prev = history[history.length - 1];
		set({ ...prev, history: history.slice(0, -1) } as GameState);
	},
	setCurrentPlayer: (player: PlayerData) => set({ currentPlayer: player }),

	setMode: (mode: GameMode) => set({ mode }),
	setPlayers: (players: PlayerData[]) => set({ players }),

	setTurn: (turn: number) => set({ turn }),

	setGameStatus: (status: GameStatus) => set({ status }),
}));
