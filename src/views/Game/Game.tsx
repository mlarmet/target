import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Tooltip } from "chart.js";
import { useEffect, useMemo } from "react";
import { useBlocker, useNavigate } from "react-router-dom";

import { useGameStore } from "@/store/game.store";

import DartBoardComp from "@/components/DartBoard/DartBoardComp";
import End from "@/components/End/End";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import PlayerCard from "@/components/PlayerCard/PlayerCard";
import Stats from "@/components/Stats/Stats";

import { GameEngine } from "@/game/GameEngine";
import { getPlayerRemainingScore, getPlayerShots, getPlayerShotsCount, getShotText } from "@/utils/score";

// import dartboard from "@/assets/images/dartboard.svg";

import "./Game.scss";

export default function Game() {
	const navigation = useNavigate();

	const { players, turn, currentPlayer, status, started, setStarted, resetGame } = useGameStore((state) => state);

	const getShotIndex = () => {
		const shots: Record<number, Segment | null> = getPlayerShots(currentPlayer?.name);

		if (!shots[0]) return 0;
		if (!shots[1]) return 1;
		// Define or not => last shot
		return 2;
	};

	const handler = useMemo(
		() => (e: BeforeUnloadEvent) => {
			if (started && status !== "end") e.preventDefault();
		},

		[started, status],
	);

	useEffect(() => {
		window.addEventListener("beforeunload", handler);
		return () => window.removeEventListener("beforeunload", handler);
	}, [handler]);

	useBlocker(() => {
		if (!started || status == "end") return false;
		const exit = confirm("Quitter la partie ?");

		if (exit) resetGame();

		return !exit;
	});

	useEffect(() => {
		if (players.length === 0 || players.every((p) => p.name === "")) {
			navigation("/setup");
			return;
		}

		if (!started) {
			GameEngine.init();
			setStarted(true);
		}

		ChartJS.register(
			CategoryScale, // axe X (labels)
			LinearScale, // axe Y (valeurs)
			BarElement, // bar chart
			LineElement, // ligne
			PointElement, // points ligne
			Tooltip, // hover tooltip
			Legend,
		);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!started) return null;

	return (
		<>
			{status === "end" && <End />}
			<Stats />
			<Header reverse />
			<main id="game">
				<div id="right">
					<DartBoardComp />
				</div>

				<div id="left">
					<div id="titles">
						<h1 className="title main">{getPlayerRemainingScore(currentPlayer?.name || "")}</h1>
						<div id="actions" className="form-row">
							<button type="button" id="undo-btn" className="btn danger icon" onClick={() => GameEngine.undoShot()}>
								<span className="material-symbols-outlined">undo</span>
							</button>

							<div id="counter" className="form-col">
								<h2 className="title secondary">Shots {getPlayerShotsCount(currentPlayer?.name)}</h2>
								<p>Tour {turn}</p>
							</div>
						</div>
					</div>

					<div className="form-container">
						<h3 className="form-title">Tours</h3>

						<div id="turns" className={`form-row${status === "idle" ? "" : ` ${status}`}`}>
							<div className={`title secondary turn-value${getShotIndex() === 0 ? " current" : ""}`}>{getShotText(0)}</div>
							<div className={`title secondary turn-value${getShotIndex() === 1 ? " current" : ""}`}>{getShotText(1)}</div>
							<div className={`title secondary turn-value${getShotIndex() === 2 ? " current" : ""}`}>{getShotText(2)}</div>
						</div>
					</div>

					{/* <div id="stats" className="form-container">
						<h3 className="form-title">Stats</h3>

						<div className="form-row">
							<div className="stat">
								<p className="name">Last</p>
								<h3 className="title main value">{getPlayerLastShot(currentPlayer?.name)}</h3>
							</div>
							<div className="stat">
								<p className="name">Avg.</p>
								<h3 className="title main value">{(getPlayerAverageShot(currentPlayer?.name) || 0).toFixed(1)}</h3>
							</div>
							<div className="stat">
								<p className="name">Best</p>
								<h3 className="title main value">{getPlayerBestShot(currentPlayer?.name)}</h3>
							</div>
						</div>
					</div> */}

					<div id="players" className="form-container">
						<h3 className="form-title">Joueurs</h3>
						<div id="players-list" className="form-col">
							{players.map((player, i) => (
								<PlayerCard player={player} key={i} current={currentPlayer?.name === player.name} />
							))}
						</div>
					</div>
				</div>
			</main>
			<Footer reverse />
		</>
	);
}
