import { useEffect, useRef, useState } from "react";

import DartBoard from "@/game/DartBoard";

import { useGameStore } from "@/store/game.store";
import "./DartBoardComp.scss";

export default function DartBoardComp() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [dashBoard, setDashBoard] = useState<DartBoard | null>(null);

	const currentPlayer = useGameStore((state) => state.currentPlayer);

	useEffect(() => {
		if (!canvasRef.current || !dashBoard) return;

		// Reset selected segment on player change and redraw
		dashBoard.redraw();
	}, [currentPlayer]);

	useEffect(() => {
		if (!canvasRef.current) return;

		const dashBoard = new DartBoard();
		dashBoard.init(canvasRef.current);

		setDashBoard(dashBoard);

		window.addEventListener("resize", dashBoard.resize);
		window.addEventListener("scroll", dashBoard.resize);
		window.addEventListener("orientationchange", dashBoard.resize);

		dashBoard.resize();

		return () => {
			window.removeEventListener("resize", dashBoard.resize);
			window.removeEventListener("scroll", dashBoard.resize);
			window.removeEventListener("orientationchange", dashBoard.resize);

			window.removeEventListener("DOMContentLoaded", dashBoard.resize);
		};
	}, [canvasRef]);

	return (
		<div id="board-container">
			<canvas ref={canvasRef} />
		</div>
	);
}
