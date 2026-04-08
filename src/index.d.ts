// ------- Game Types -------

type PlayerType = "gris" | "jaune";
type Players = Record<PlayerType, Player>;

type Stocks = Record<PlayerType, Animal[]>;

type PionType = "minou" | "matou";

type Characters = {
	[key in PionType]: {
		plateau: number;
		stock: number;
	};
};

type GameStatus = "IDLE" | "SELECT" | "ROW" | "MOVING" | "WON" | "STOPPED";

// ------- Modal Types -------

type ModalType = "quit" | "reset" | "credit" | "qrCodeError" | "errorCode" | "qrCode" | "qrScan" | "errorCamera" | "errorHost" | "lostConnection";

type ModalProperties = {
	title: string;
	text: string;

	actions?: {
		cancel?: {
			action?: CallableFunction;
			text: string;
		};
		confirm?: {
			action?: CallableFunction;
			text: string;
		};
	};
};

type ModalActions = {
	cancel?: CallableFunction;
	confirm?: CallableFunction;
};

// ------- Connection Types -------

type ConnectionType = "host" | "join";

type DataType = "init" | "place" | "pick";

type PlaceEventData = {
	player: PlayerType;
	animal: PionType;
	row: number;
	col: number;
};

type PickDataEvent = {
	player: PlayerType;
	row: row;
	col: col;
};
