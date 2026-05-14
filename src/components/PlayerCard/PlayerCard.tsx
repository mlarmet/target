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
		<div ref={ref} className={`player-card${current ? " current" : ""}${player.endPos > 0 ? " end" : ""}`}>
			{player.endPos > 0 ? (
				<div className="player-pos small" data-endpos={player.endPos}>
					<h3 className="title">{player.endPos}</h3>
				</div>
			) : (
				<div className="circle" />
			)}

			<p className="player-name">{player.name}</p>

			<button className="btn tertiary icon" onClick={handleViewDetails}>
				<span className="material-symbols-outlined">bar_chart_4_bars</span>
			</button>
			<h3 className="player-score title secondary">{getPlayerRemainingScore(player.name)}</h3>
		</div>
	);
}
