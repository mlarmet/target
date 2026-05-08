import { useGameStore } from "@/store/game.store";
import { getPlayerRemainingScore } from "@/utils/score";

export class GameEngine {
	static init() {
		const gameState = useGameStore.getState();

		gameState.setCurrentPlayer(gameState.players[0]);
	}

	static getCurrentPlayer = () => {
		const gameState = useGameStore.getState();
		return gameState.players.find((p) => p.name === useGameStore.getState().currentPlayer?.name);
	};

	static getCurrentPlayerIndex = () => {
		const gameState = useGameStore.getState();
		return gameState.players.findIndex((p) => p.name === useGameStore.getState().currentPlayer?.name);
	};

	static nextPlayer() {
		const gameState = useGameStore.getState();
		const activePlayers = gameState.players.filter((p) => !p.end);

		if (activePlayers.length <= 1) {
			gameState.setCurrentPlayer({ name: "", end: true, score: {} });
			// TODO : popup game over
			gameState.setGameStatus("end");
			return;
		}

		const index = activePlayers.findIndex((p) => p.name === gameState.currentPlayer?.name);
		const nextIndex = (index + 1) % activePlayers.length;
		const nextPlayer = activePlayers[nextIndex];

		// New turn = le next est "avant" le current dans l'ordre original
		const currentOrigIndex = gameState.players.findIndex((p) => p.name === gameState.currentPlayer?.name);
		const nextOrigIndex = gameState.players.findIndex((p) => p.name === nextPlayer.name);
		if (nextOrigIndex < currentOrigIndex) gameState.setTurn(gameState.turn + 1);

		gameState.setCurrentPlayer(nextPlayer);
		gameState.setGameStatus("idle");
	}

	static shot(segment: Segment) {
		const gameState = useGameStore.getState();

		// Prevent shot when waiting to change player
		if (gameState.status !== "idle") return;

		gameState.pushHistory();

		const updatedPlayers = gameState.players.map((p) => {
			if (p.name !== gameState.currentPlayer?.name) return p;

			const playerScore = [...(p.score[gameState.turn - 1] || [])];

			const remainingScore = getPlayerRemainingScore(gameState.currentPlayer?.name);
			const nextRemainingScore = remainingScore - segment.value * Math.floor(segment.multiplier);

			// bust
			if (nextRemainingScore < 0) {
				segment.bust = true;
				gameState.setGameStatus("bust");
				setTimeout(() => GameEngine.nextPlayer(), 1250);
			}

			// bust
			if (nextRemainingScore === 0) {
				p.end = true;
				gameState.setGameStatus("finish");
				setTimeout(() => GameEngine.nextPlayer(), 1250);
			}

			playerScore.push(segment);

			// Shot 3
			if (playerScore.length === 3) {
				gameState.setGameStatus("wait");
				setTimeout(() => GameEngine.nextPlayer(), 1250);
			}

			return {
				...p,
				score: {
					...p.score,
					[gameState.turn - 1]: playerScore,
				},
			};
		});

		gameState.setPlayers(updatedPlayers);
	}

	static undoShot() {
		const gameState = useGameStore.getState();

		// Prevent shot when waiting to change player
		if (gameState.status !== "idle") return;

		gameState.undo();
	}
}
