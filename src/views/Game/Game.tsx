import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGameStore } from "@/store/game.store";

import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import PlayerCard from "@/components/PlayerCard/PlayerCard";

import { GameEngine } from "@/game/GameEngine";
import { getAverageShot, getBestShot, getLastShot, getPlayerCurrentScore, getPlayerRemainingScore, getPlayerShotsCount } from "@/utils/score";

import dartboard from "@/assets/images/dartboard.svg";

import "./Game.scss";

export default function Game() {
	const navigation = useNavigate();

	const { players, turn, currentPlayer } = useGameStore((state) => state);

	const [gameEngine, setGameEngine] = useState<GameEngine | null>(null);

	const getShot = (count: number) => {
		const shots: Record<number, Segment | null> = getPlayerCurrentScore();
		const shot = shots[count];

		if (!shot) return ".";

		if (shot.value === 0) return "-";
		// Bull
		if (shot.value === 25) return shot.value * shot.multiplier;
		// Triple
		if (shot.multiplier === 3) return `T${shot.value}`;
		// Double
		if (shot.multiplier === 2) return `D${shot.value}`;

		return `${shot.value}`;
	};

	const getShotIndex = () => {
		const shots: Record<number, Segment | null> = getPlayerCurrentScore();

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

		if (!gameEngine) setGameEngine(new GameEngine());
		GameEngine.init();

		setTimeout(() => GameEngine.nextPlayer(), 1000);
		setTimeout(() => {
			GameEngine.shot({ value: 10, multiplier: 1 });
		}, 5000);
		setTimeout(() => {
			GameEngine.shot({ value: 20, multiplier: 1 });
		}, 10000);
	}, []);

	if (!gameEngine) return null;

	return (
		<>
			<Header reverse />
			<main id="game">
				<div id="right">
					<img id="decoration" src={dartboard} alt="decoration" />
				</div>

				<div id="left">
					<div id="titles">
						<h1 className="title main">{getPlayerRemainingScore(currentPlayer)}</h1>

						<div id="counter" className="form-col">
							<h2 className="title secondary">Shots {getPlayerShotsCount()}</h2>
							<p>Tour {turn}</p>
						</div>
					</div>

					<div className="form-container">
						<h3 className="form-title">Tours</h3>

						<div id="turns" className="form-row">
							<div className={`title secondary turn-value${getShotIndex() === 0 ? " current" : ""}`}>{getShot(0)}</div>
							<div className={`title secondary turn-value${getShotIndex() === 1 ? " current" : ""}`}>{getShot(1)}</div>
							<div className={`title secondary turn-value${getShotIndex() === 2 ? " current" : ""}`}>{getShot(2)}</div>
						</div>
					</div>

					<div className="form-container">
						<h3 className="form-title">Joueurs</h3>
						<div id="players" className="form-col">
							{players.map((player, i) => (
								<PlayerCard player={player} key={i} current={currentPlayer === player.name} />
							))}
						</div>
					</div>

					<div className="form-container">
						<h3 className="form-title">Stats</h3>

						<div className="form-row">
							<div className="stat">
								<p className="name">Last</p>
								<h3 className="title main value">{getLastShot()}</h3>
							</div>
							<div className="stat">
								<p className="name">Avg.</p>
								<h3 className="title main value">{getAverageShot()}</h3>
							</div>
							<div className="stat">
								<p className="name">Best</p>
								<h3 className="title main value">{getBestShot()}</h3>
							</div>
						</div>
					</div>
				</div>
			</main>
			<Footer reverse />
		</>
	);
}
