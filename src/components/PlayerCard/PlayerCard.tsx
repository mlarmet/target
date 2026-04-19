import { getPlayerRemainingScore } from "@/utils/score";

import "./PlayerCard.scss";

interface PlayerCardProps {
	player: PlayerData;
	current: boolean;
}

export default function PlayerCard({ player, current = false }: PlayerCardProps) {
	return (
		<div className={`player-card${current ? " current" : ""}`}>
			<div className="name">
				<div className="circle" />
				<p className="player-name">{player.name}</p>
			</div>
			<h3 className="player-score title secondary">{getPlayerRemainingScore(player.name)}</h3>
		</div>
	);
}
