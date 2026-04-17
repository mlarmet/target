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

const MAX_PLAYERS = 10;
const GAME_MODES: GameMode[] = ["501", "301"];
const NO_ERROR: PlayerError = { code: 0, text: "" };
const NEW_PLAYER: PlayerData = { name: "", dartCount: 0, score: [] };

export default function Setup() {
	const [showFullAlert, setShowFullAlert] = useState(false);

	const navigate = useNavigate();

	const { mode, setMode, players, setPlayers } = useGameStore();

	const [errors, setErrors] = useState<PlayerError[]>([]);

	const validateAll = (players: PlayerData[], prevErrors: PlayerError[]): PlayerError[] => {
		return players.map((player, i) => validatePlayer(player.name, prevErrors[i]));
	};

	const validatePlayer = (name: string, prevError: PlayerError): PlayerError => {
		const trimmed = name.trim();
		if (!trimmed) return { code: -1, text: "Le nom est requis" };
		if (trimmed.toLowerCase() === "christophe mae") {
			if (prevError.code === -2) {
				return { code: -3, text: "J'ai dit non." };
			}
			if (prevError.code === -3 || prevError.code === -4) {
				return { code: -4, text: "J'ai dit non." };
			}

			return { code: -2, text: "Nom interdit" };
		}
		if (trimmed.toLowerCase() === "anaelle") return { code: 1, text: "Anaelle ?" }; // TODO : joke

		// TODO : same name

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
		players.push(NEW_PLAYER);
		setPlayers(players);

		setErrors((e) => [...e, NO_ERROR]);
	};

	const updatePlayer = (index: number, value: string) => {
		const next = players.map((player, i) => ({ ...player, name: i === index ? value : player.name }));
		setPlayers(next);
	};

	const removePlayer = (index: number) => {
		const next = players.filter((_, i) => i !== index);
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
					<h1 className="title main">Nouvelle partie</h1>

					<form action={startGame}>
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
							<h3 className="form-title">Joueurs</h3>
							<div id="players" className="form-col">
								{players.map((player, i) => (
									<React.Fragment key={i}>
										<div className="form-row">
											<input
												type="text"
												name={`player-${i + 1}`}
												id={`player-${i + 1}`}
												value={player.name}
												placeholder={`Joueur ${i + 1}`}
												className="input"
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
													✕
												</button>
											)}
										</div>
										{errors?.[i] && errors?.[i].code !== 0 && (
											<div className={`form-validation ${errors?.[i].code < 0 ? "alert" : "warning"}`}>{errors?.[i].text}</div>
										)}
									</React.Fragment>
								))}
								{players.length < MAX_PLAYERS && (
									<button type="button" className="btn secondary" onClick={addPlayer}>
										＋ Ajouter un joueur
									</button>
								)}
							</div>
						</div>

						<button id="start-game" type="submit" className="btn">
							Lancer la partie
						</button>
					</form>
				</div>

				<div id="right">
					<img id="decoration" src={dartboard} alt="decoration" />
				</div>
			</main>
			<Footer />
		</>
	);
}
