import { useEffect, useRef } from "react";

import { getPlayerRemainingScore } from "@/utils/score";

import { useGameStore } from "@/store/game.store";
import "./PlayerCard.scss";

interface PlayerCardProps {
	player: PlayerData;
	current: boolean;
}

export default function PlayerCard({ player, current = false }: PlayerCardProps) {
	const ref = useRef<HTMLDivElement>(null);

	const { currentPlayer, showPlayerDetails: showDetails } = useGameStore((state) => state);

	const handleViewDetails = () => {
		showDetails(player);
	};

	useEffect(() => {
		if (!ref.current || !currentPlayer) return;

		if (currentPlayer.name === player.name) {
			ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	}, [currentPlayer?.name]);
	return (
		<div ref={ref} className={`player-card${current ? " current" : ""}${player?.end ? " end" : ""}`}>
			<div className="name">
				<div className="circle" />
				<p className="player-name">{player.name}</p>
			</div>

			<button className="btn tertiary icon" onClick={handleViewDetails}>
				<span className="material-symbols-outlined">visibility</span>
			</button>
			<h3 className="player-score title secondary">{getPlayerRemainingScore(player.name)}</h3>
		</div>
	);
}
