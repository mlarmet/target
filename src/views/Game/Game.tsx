import { useGameStore } from "@/store/game.store";

import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";

import dartboard from "@/assets/images/dartboard.svg";

import PlayerCard from "@/components/PlayerCard/PlayerCard";
import "./Game.scss";

export default function Game() {
	const { players, turn } = useGameStore();

	return (
		<>
			<Header reverse />
			<main id="game">
				<div id="right">
					<img id="decoration" src={dartboard} alt="decoration" />
				</div>

				<div id="left">
					<div id="titles">
						<h1 className="title main">465</h1>

						<div id="counter" className="form-col">
							<h2 className="title secondary">Shots 0</h2>
							<p>Tour {turn}</p>
						</div>
					</div>

					<div className="form-container">
						<h3 className="form-title">Tours</h3>

						<div id="turns" className="form-row">
							<div className="shot-1 title secondary turn-value">10</div>
							<div className="shot-2 title secondary turn-value current">T20</div>
							<div className="shot-3 title secondary turn-value">-</div>
						</div>
					</div>

					<div className="form-container">
						<h3 className="form-title">Joueurs</h3>
						<div id="players" className="form-col">
							{players.map((player, i) => (
								<PlayerCard player={player} key={i} current={i === 1} />
							))}
						</div>
					</div>

					<div className="form-container">
						<h3 className="form-title">Stats</h3>

						<div className="form-row">
							<div className="stat">
								<p className="name">Last</p>
								<h3 className="title main value">54</h3>
							</div>
							<div className="stat">
								<p className="name">Avg.</p>
								<h3 className="title main value">54.4</h3>
							</div>
							<div className="stat">
								<p className="name">Best</p>
								<h3 className="title main value">54</h3>
							</div>
						</div>
					</div>
				</div>
			</main>
			<Footer reverse />
		</>
	);
}
