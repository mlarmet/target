import type { MouseEvent } from "react";

import BarStats from "@/components/Chart/Bar/Bar";
import LineStats from "@/components/Chart/Line/Line";

import { useGameStore } from "@/store/game.store";

import { getPlayerAverageShot, getPlayerBestShot, getPlayerLastShot, getPlayerMissPercent, getPlayerRemainingScore, getPlayerShotsCount } from "@/utils/score";

import "./Stats.scss";

export default function Stats() {
	const { playerDetails, showPlayerDetails } = useGameStore((state) => state);

	const hidePopup = () => showPlayerDetails(null);

	const handleClickOutside = (event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
		const target = event.target as HTMLElement;

		if (target.id === "stats") hidePopup();
	};

	if (!playerDetails) return null;

	return (
		<div id="stats" className="popup" onClick={handleClickOutside}>
			<div id="stats-content">
				<div className="top">
					<div className="titles">
						<h3 className="form-title">{playerDetails.name}</h3>
						<h1 className="title main">{getPlayerRemainingScore(playerDetails.name || "")}</h1>
					</div>
					<button type="button" id="undo-btn" className="btn danger icon" onClick={hidePopup}>
						<span className="material-symbols-outlined">close</span>
					</button>
				</div>

				<div className="stats-row">
					<div className="stats-box stats-legs">
						<h3 className="form-title">Stats par manche</h3>
						<div className="stats-grid">
							<div className="stat">
								<p className="name">Last</p>
								<h3 className="title main value">{getPlayerLastShot(playerDetails.name)}</h3>
							</div>
							<hr className="grid-separator" />
							<div className="stat">
								<p className="name">Moyen.</p>
								<h3 className="title main value">{(getPlayerAverageShot(playerDetails.name) || 0).toFixed(1)}</h3>
							</div>
							<hr className="grid-separator" />
							<div className="stat">
								<p className="name">Best</p>
								<h3 className="title main value">{getPlayerBestShot(playerDetails.name)}</h3>
							</div>
						</div>
					</div>
					<div className="stats-box stats-global">
						<h3 className="form-title">Stats globlale</h3>
						<div className="stats-grid">
							<div className="stat">
								<p className="name">Shots</p>
								<h3 className="title main value">{getPlayerShotsCount(playerDetails.name)}</h3>
							</div>
							<hr className="grid-separator" />
							<div className="stat">
								<p className="name">Out</p>
								<h3 className="title main value">{(getPlayerMissPercent(playerDetails.name) || 0).toFixed(1)}%</h3>
							</div>
						</div>
					</div>
				</div>

				<hr className="box-separator" />

				<div className="stats-row">
					<div className="stats-box stats-charts-turns">
						<h3 className="form-title">Points par manche</h3>
						<BarStats />
					</div>
					<div className="stats-box stats-charts-score">
						<h3 className="form-title">Évolution du score</h3>
						<LineStats />
					</div>
				</div>
			</div>
		</div>
	);
}
