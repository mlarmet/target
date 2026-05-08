import { useGameStore } from "@/store/game.store";

const getCurrentPlayer = () => {
	return useGameStore.getState().players.find((p) => p.name === useGameStore.getState().currentPlayer?.name);
};

export const getPlayerScore = (name: string) => {
	const gameState = useGameStore.getState();

	const player = gameState.players.find((p) => p.name === name);
	if (!player) return 0;

	const scoreLength = Object.keys(player.score).length;
	if (scoreLength === 0) return 0;

	let score = 0;
	for (let i = 0; i < scoreLength; i++) {
		if (player.score[i].some((s) => s.bust)) continue;
		const shots = player.score[i].map((s) => s.value * Math.floor(s.multiplier));
		score += shots.reduce((acc, shot) => acc + shot, 0);
	}
	return score;
};

export const getPlayerRemainingScore = (name: string) => {
	return useGameStore.getState().mode - getPlayerScore(name);
};

export const getCurrentPlayerLastShot = () => {
	const player = getCurrentPlayer();
	if (!player) return 0;

	const key = useGameStore.getState().turn - 2;

	if (!player.score[key]) return 0;
	if (player.score[key].some((s) => s.bust)) return 0;

	return player.score[key].reduce((acc, shot) => acc + shot.value * Math.floor(shot.multiplier), 0);
};

export const getCurrentPlayerAverageShot = () => {
	const player = getCurrentPlayer();
	if (!player) return 0;

	const allScore = [];
	for (let i = 0; i < Object.keys(player.score).length; i++) {
		if (player.score[i].length === 0) continue;

		if (player.score[i].some((s) => s.bust)) {
			allScore.push(0);
			continue;
		}

		const shots = player.score[i].map((s) => s.value * Math.floor(s.multiplier));
		allScore.push(shots.reduce((acc, shot) => acc + shot, 0));
	}

	if (!allScore.length) return 0;

	return allScore.reduce((acc, shot) => acc + shot, 0) / allScore.length;
};

export const getCurrentPlayerBestShot = () => {
	const player = getCurrentPlayer();
	if (!player) return 0;

	const allScore = [];
	for (let i = 0; i < Object.keys(player.score).length; i++) {
		if (player.score[i].some((s) => s.bust)) continue;
		const shots = player.score[i].map((s) => s.value * Math.floor(s.multiplier));
		allScore.push(shots.reduce((acc, shot) => acc + shot, 0));
	}

	if (!allScore.length) return 0;

	return Math.max(...allScore);
};

export const getCurrentPlayerShotsCount = () => {
	const player = getCurrentPlayer();
	if (!player) return 0;

	let totalShot = 0;
	for (let i = 0; i < Object.keys(player.score).length; i++) {
		totalShot += player.score[i].length;
	}

	return totalShot;
};

export const getCurrentPlayerShots = () => {
	const player = getCurrentPlayer();

	if (!player)
		return {
			0: null,
			1: null,
			2: null,
		};

	return getPlayerShots(player.name);
};

export const getPlayerShots = (name: string) => {
	const player = useGameStore.getState().players.find((p) => p.name === name);

	if (!player)
		return {
			0: null,
			1: null,
			2: null,
		};

	const key = useGameStore.getState().turn - 1;
	const shots = player.score[key];

	if (!shots)
		return {
			0: null,
			1: null,
			2: null,
		};

	return {
		0: shots[0] || null,
		1: shots[1] || null,
		2: shots[2] || null,
	};
};

export const getShotText = (count: number) => {
	const shots: Record<number, Segment | null> = getCurrentPlayerShots();
	const shot = shots[count];

	// No shot
	if (!shot) return ".";
	// Miss
	if (shot.value === 0) return "x";
	// Bull
	if (shot.value === 25) return shot.value * Math.floor(shot.multiplier);
	// Triple
	if (shot.multiplier === 3) return `T${shot.value}`;
	// Double
	if (shot.multiplier === 2) return `D${shot.value}`;

	return `${shot.value}`;
};
