import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGameStore } from "@/store/game.store";

import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";

import dartboard from "@/assets/images/dartboard.svg";

import "./Setup.scss";

interface PlayerError {
	code: number;
	text: string;
}

const GAME_MODES: GameMode[] = [501, 301, 201];
const NO_ERROR: PlayerError = { code: 0, text: "" };
const NEW_PLAYER: PlayerData = { name: "", score: [], endPos: 0, startOrder: 0 };

export default function Setup() {
	const [randomOrder, setRandomOrder] = useState(true);
	const [showFullAlert, setShowFullAlert] = useState(false);

	const navigate = useNavigate();

	const { mode, setMode, players, setPlayers } = useGameStore();

	const [errors, setErrors] = useState<PlayerError[]>([]);

	const validateAll = (players: PlayerData[], prevErrors: PlayerError[]): PlayerError[] => {
		return players.map((player, i) => validatePlayer(player.name, prevErrors[i]));
	};

	const shufflePlayers = (players: PlayerData[]) => {
		const arr = [...players];
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	};

	const validatePlayer = (name: string, prevError: PlayerError): PlayerError => {
		const trimmed = name.trim();
		if (!trimmed) return { code: -1, text: "Le nom est requis" };
		if (
			trimmed
				.normalize("NFD")
				.replace(/\p{Diacritic}/gu, "")
				.toLowerCase() === "christophe mae"
		) {
			if (prevError.code === -2) {
				return { code: -3, text: "J'ai dit non." };
			}
			if (prevError.code === -3 || prevError.code === -4) {
				return { code: -4, text: "J'ai dit non." };
			}

			return { code: -2, text: "Nom interdit" };
		}

		const occ: Record<string, number> = {};
		for (const name of players.map((p) => p.name)) {
			occ[name] = (occ[name] || 0) + 1;
		}

		if (occ[trimmed] > 1) {
			return { code: -5, text: "Nom déjà utilisé" };
		}

		return NO_ERROR;
	};

	const handleBlur = (index: number) => {
		setErrors((prev) => {
			const next = [...prev];
			next[index] = validatePlayer(players[index].name, next[index]);
			return next;
		});
	};

	const handleFocus = (index: number) => {
		setErrors((prev) => {
			const next = [...prev];
			next[index] = NO_ERROR;
			return next;
		});
	};

	const addPlayer = () => {
		players.forEach((p, i) => (p.startOrder = i));
		players.push({ ...NEW_PLAYER, startOrder: players.length });
		setPlayers(players);

		setErrors((e) => [...e, NO_ERROR]);
	};

	const updatePlayer = (index: number, value: string) => {
		const next = players.map((player, i) => ({ ...player, name: i === index ? value : player.name }));
		setPlayers(next);
	};

	const removePlayer = (index: number) => {
		const next = players.filter((_, i) => i !== index);
		next.forEach((p, i) => (p.startOrder = i));
		setPlayers(next);
		setErrors((prev) => [...prev].filter((_, i) => i !== index));
	};

	const startGame = () => {
		if (showFullAlert) return;

		const playerErrors = validateAll(players, errors);
		if (playerErrors.some((p) => p.code < 0)) {
			setErrors(playerErrors);

			if (playerErrors.some((p) => p.code === -4)) setShowFullAlert(true);

			return;
		}
		setErrors([]);

		if (randomOrder) setPlayers(shufflePlayers(players));

		// Start game
		navigate("/game");
	};

	useEffect(() => {
		if (showFullAlert) {
			// animation duration + time to read
			setTimeout(() => setShowFullAlert(false), 5000);
		}
	}, [showFullAlert]);

	return (
		<>
			<Header reverse />
			<main id="setup">
				<div id="full-screen-alert" className={showFullAlert ? "show" : "hidden"}>
					<p>J'ai dit non, c'est moi qui décide. D'accord ?</p>
				</div>
				<div id="left">
					<form action={startGame}>
						<h1 className="title main">Nouvelle partie</h1>

						<div className="form-container">
							<h3 className="form-title">Mode de jeu</h3>
							<div id="mode" className="form-row">
								{GAME_MODES.map((m) => (
									<React.Fragment key={m}>
										<input
											type="radio"
											name="mode"
											id={`mode-${m}`}
											value={m}
											className="input"
											checked={mode === m}
											onChange={() => setMode(m)}
										/>
										<label htmlFor={`mode-${m}`}>{m}</label>
									</React.Fragment>
								))}
							</div>
						</div>

						<div className="form-container">
							<div id="players-title" className="form-row">
								<h3 className="form-title">Joueurs</h3>
								<div id="random-order" className="form-row">
									<input
										type="checkbox"
										id="random-order-input"
										name="random-order"
										className="input"
										checked={randomOrder}
										onChange={(e) => setRandomOrder(e.target.checked)}
									/>
									<label className="checkbox-label" htmlFor="random-order-input">
										Aléatoire
										<span className="box">{randomOrder && <span className="material-symbols-outlined icon">check</span>}</span>
									</label>
								</div>
							</div>
							<div id="players" className="form-col">
								{structuredClone(players)
									.sort((a, b) => a.startOrder - b.startOrder)
									.map((player, i) => (
										<React.Fragment key={i}>
											<div className="form-row">
												<input
													type="text"
													name={`player-${i + 1}`}
													id={`player-${i + 1}`}
													value={player.name}
													placeholder={`Joueur ${i + 1}`}
													className="input"
													maxLength={__MAX_LENGTH__.name}
													onChange={(e) => updatePlayer(i, e.target.value)}
													onBlur={() => handleBlur(i)}
													onFocus={() => handleFocus(i)}
												/>
												{i >= 2 && (
													<button
														type="button"
														className="btn danger icon"
														onClick={() => removePlayer(i)}
														aria-label={`Supprimer joueur ${i + 1}`}
													>
														<span className="material-symbols-outlined">close</span>
													</button>
												)}
											</div>
											{errors?.[i] && errors?.[i].code !== 0 && (
												<div className={`form-validation ${errors?.[i].code < 0 ? "alert" : "warning"}`}>{errors?.[i].text}</div>
											)}
										</React.Fragment>
									))}
								{players.length < __MAX_LENGTH__.players && (
									<button type="button" className="btn secondary" onClick={addPlayer}>
										<span className="material-symbols-outlined">add</span> Ajouter un joueur
									</button>
								)}
							</div>
						</div>

						<button id="start-game" type="submit" className="btn" disabled={players.length < 2}>
							Lancer la partie
						</button>
					</form>
				</div>

				<img id="decoration" src={dartboard} alt="decoration" />
			</main>
			<Footer />
		</>
	);
}
