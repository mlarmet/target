import { useGameStore } from "@/store/game.store";

import "./PlayerCard.scss";

interface PlayerCardProps {
	player: PlayerData;
	current: boolean;
}

export default function PlayerCard({ player, current = false }: PlayerCardProps) {
	const { mode } = useGameStore();

	const getScore = () => {
		const total = parseInt(mode);
		const score = player.score.reduce((a, b) => a + b, 0);
		return `${total - score}`;
	};

	return (
		<div className={`player-card${current ? " current" : ""}`}>
			<div className="name">
				<div className="circle" />
				<p className="player-name">{player.name}</p>
			</div>
			<h3 className="player-score title secondary">{getScore()}</h3>
		</div>
	);
}
