import { useGameStore } from "@/store/game.store";

const getCurrentPlayer = () => {
	return useGameStore.getState().players.find((p) => p.name === useGameStore.getState().currentPlayer);
};
export const getPlayerScore = (name: string) => {
	const gameState = useGameStore.getState();

	const player = gameState.players.find((p) => p.name === name);
	if (!player) return 0;

	const scoreLength = Object.keys(player.score).length;
	if (scoreLength === 0) return 0;

	let score = 0;
	for (let i = 0; i < scoreLength; i++) {
		const shots = player.score[i];
		if (!shots) continue;

		for (const shot of shots) {
			score += shot.value * shot.multiplier;
		}
	}
	return score;
};

export const getPlayerRemainingScore = (name: string) => {
	return parseInt(useGameStore.getState().mode) - getPlayerScore(name);
};

export const getLastShot = () => {
	const player = getCurrentPlayer();
	const key = useGameStore.getState().turn - 1;

	if (!player || !player.score[key] || player.score[key].length === 0) return 0;

	const lastShot = player.score[key][player.score[key].length - 1];
	return lastShot.value * lastShot.multiplier;
};

export const getAverageShot = () => {
	const player = getCurrentPlayer();

	if (!player) return 0;

	const total = getPlayerScore(player.name);

	if (total <= 0) return 0;

	const shots = getPlayerShotsCount();

	if (shots <= 0) return 0;

	return (total / shots).toFixed(1);
};

export const getBestShot = () => {
	const player = getCurrentPlayer();

	if (!player) return 0;

	let maxScore = 0;
	for (let i = 0; i < Object.keys(player.score).length; i++) {
		maxScore = Math.max(maxScore, ...player.score[i].map((s) => s.value * s.multiplier));
	}

	return maxScore;
};

export const getPlayerShotsCount = () => {
	const player = getCurrentPlayer();

	if (!player) return 0;

	let totalShot = 0;
	for (let i = 0; i < Object.keys(player.score).length; i++) {
		totalShot += player.score[i].length;
	}

	return totalShot;
};

export const getPlayerCurrentScore = () => {
	const player = getCurrentPlayer();

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
