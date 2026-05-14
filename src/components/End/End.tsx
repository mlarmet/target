import { useGameStore } from "@/store/game.store";

import { getPlayerShotsCount } from "@/utils/score";
import { useNavigate } from "react-router-dom";
import "./End.scss";

export default function End() {
	const navigate = useNavigate();

	const { players, resetGame, showPlayerDetails } = useGameStore((state) => state);

	const handleClose = () => {
		resetGame();
		navigate("/setup");
	};

	const handlePosClick = (player: PlayerData) => {
		showPlayerDetails(player);
	};

	return (
		<div id="end" className="popup">
			<div id="end-content">
				<h1 className="title main">Partie terminée !</h1>

				<div id="players-top">
					{structuredClone(players)
						.filter((player) => player.endPos > 0)
						.sort((a, b) => a.endPos - b.endPos)
						.map((player) => (
							<div key={player.name} className="player-top-row">
								<div className="player-pos" data-endpos={player.endPos}>
									<h3 className="title secondary" onClick={() => handlePosClick(player)}>
										{player.endPos}
									</h3>
								</div>
								<button className="btn secondary icon" onClick={() => handlePosClick(player)}>
									<span className="material-symbols-outlined">bar_chart_4_bars</span>
								</button>
								<h3 className="form-title player-name">{player.name}</h3>
								<p className="player-shot">(en {getPlayerShotsCount(player.name)} fléchettes)</p>
							</div>
						))}
				</div>
				<button type="button" id="close-btn" className="btn" onClick={handleClose}>
					Rejouer
				</button>
			</div>
		</div>
	);
}
