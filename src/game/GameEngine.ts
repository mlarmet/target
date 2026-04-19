import { useGameStore } from "@/store/game.store";

export class GameEngine {
	static init() {
		const gameState = useGameStore.getState();

		gameState.setCurrentPlayer(gameState.players[0].name);
	}

	static nextPlayer() {
		const gameState = useGameStore.getState();

		const index = gameState.players.findIndex((p) => p.name === gameState.currentPlayer);
		if (index === -1) return;

		const nextPlayer = gameState.players[(index + 1) % gameState.players.length].name;

		// First player to play => new turn
		if (nextPlayer === gameState.players[0].name) gameState.setTurn(gameState.turn + 1);

		gameState.setCurrentPlayer(nextPlayer);
	}

	static shot(segment: Segment) {
		const gameState = useGameStore.getState();

		const updatedPlayers = gameState.players.map((p) => {
			if (p.name !== gameState.currentPlayer) return p;

			const playerScore = [...(p.score[gameState.turn - 1] || [])];
			playerScore.push(segment);

			if (playerScore.length === 3) GameEngine.nextPlayer();

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
}
