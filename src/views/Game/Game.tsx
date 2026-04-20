import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGameStore } from "@/store/game.store";

import DartBoardComp from "@/components/DartBoard/DartBoardComp";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import PlayerCard from "@/components/PlayerCard/PlayerCard";

import { GameEngine } from "@/game/GameEngine";
import {
	getCurrentPlayerAverageShot,
	getCurrentPlayerBestShot,
	getCurrentPlayerLastShot,
	getCurrentPlayerShots,
	getCurrentPlayerShotsCount,
	getPlayerRemainingScore,
	getShotText,
} from "@/utils/score";

// import dartboard from "@/assets/images/dartboard.svg";

import "./Game.scss";

export default function Game() {
	const navigation = useNavigate();

	const { players, turn, currentPlayer } = useGameStore((state) => state);

	const [started, setStarted] = useState(false);

	const getShotIndex = () => {
		const shots: Record<number, Segment | null> = getCurrentPlayerShots();

		if (!shots[0]) return 0;
		if (!shots[1]) return 1;
		// Define or not => last shot
		return 2;
	};

	useEffect(() => {
		if (players.length === 0) {
			navigation("/setup");
			return;
		}

		if (!started) {
			GameEngine.init();
			setStarted(true);
		}
	}, []);

	if (!started) return null;

	return (
		<>
			<Header reverse />
			<main id="game">
				<div id="right">
					<DartBoardComp />
					{/* <img id="decoration" src={dartboard} alt="decoration" />*/}
				</div>

				<div id="left">
					<div id="titles">
						<h1 className="title main">{getPlayerRemainingScore(currentPlayer)}</h1>

						<div id="counter" className="form-col">
							<h2 className="title secondary">Shots {getCurrentPlayerShotsCount()}</h2>
							<p>Tour {turn}</p>
						</div>
					</div>

					<div className="form-container">
						<div id="turns-title" className="form-row">
							<h3 className="form-title">Tours</h3>

							<button type="button" className="btn danger icon" onClick={() => GameEngine.undoShot()}>
								<span className="material-symbols-outlined">undo</span>
							</button>
						</div>

						<div id="turns" className="form-row">
							<div className={`title secondary turn-value${getShotIndex() === 0 ? " current" : ""}`}>{getShotText(0)}</div>
							<div className={`title secondary turn-value${getShotIndex() === 1 ? " current" : ""}`}>{getShotText(1)}</div>
							<div className={`title secondary turn-value${getShotIndex() === 2 ? " current" : ""}`}>{getShotText(2)}</div>
						</div>
					</div>

					<div id="stats" className="form-container">
						<h3 className="form-title">Stats</h3>

						<div className="form-row">
							<div className="stat">
								<p className="name">Last</p>
								<h3 className="title main value">{getCurrentPlayerLastShot()}</h3>
							</div>
							<div className="stat">
								<p className="name">Avg.</p>
								<h3 className="title main value">{getCurrentPlayerAverageShot()}</h3>
							</div>
							<div className="stat">
								<p className="name">Best</p>
								<h3 className="title main value">{getCurrentPlayerBestShot()}</h3>
							</div>
						</div>
					</div>

					<div id="players" className="form-container">
						<h3 className="form-title">Joueurs</h3>
						<div id="players-list" className="form-col">
							{players.map((player, i) => (
								<PlayerCard player={player} key={i} current={currentPlayer === player.name} />
							))}
						</div>
					</div>
				</div>
			</main>
			<Footer reverse />
		</>
	);
}
