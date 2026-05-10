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
			// gameState.setCurrentPlayer({ name: "", end: true, score: {} });
			// TODO : popup game over
			// gameState.setGameStatus("end");
			return;
		}

		const index = gameState.players.findIndex((p) => p.name === gameState.currentPlayer?.name);
		if (index === -1) return;

		const nextPlayer = gameState.players[(index + 1) % gameState.players.length];

		// First player to play => new turn
		if (nextPlayer.name === gameState.players[0].name) gameState.setTurn(gameState.turn + 1);

		gameState.setCurrentPlayer(nextPlayer);

		// While next player end, go next
		if (nextPlayer.end) {
			this.nextPlayer();
			return;
		}

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

			playerScore.push(segment);

			// bust
			if (nextRemainingScore < 0) {
				segment.bust = true;
				gameState.setGameStatus("bust");
				setTimeout(() => GameEngine.nextPlayer(), 1250);
			} else if (nextRemainingScore === 0) {
				// end
				p.end = true;
				gameState.setGameStatus("finish");
				setTimeout(() => GameEngine.nextPlayer(), 1250);
			} else if (playerScore.length === 3) {
				// Shot 3
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
