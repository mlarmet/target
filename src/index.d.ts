type TileColor = "red" | "green" | "white" | "black" | "selected" | "text";

type GameMode = "501" | "301";

type GameStatus = "idle" | "wait";

type PlayerData = {
	name: string;
	score: Record<number, Segment[]>;
};

type Segment = {
	value: number;
	multiplier: number;
};
