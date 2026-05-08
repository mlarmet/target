type TileColor = "red" | "green" | "white" | "black" | "selected" | "text";

type GameMode = 501 | 301;

type GameStatus = "idle" | "wait" | "bust" | "finish" | "end";

type GameSnapshot = {
	players: PlayerData[];
	currentPlayer: PlayerData | null;
	turn: number;
};

type PlayerData = {
	name: string;
	end?: boolean;
	score: Record<number, Segment[]>;
};

type Segment = {
	value: number;
	multiplier: number;
	bust?: boolean;
};
