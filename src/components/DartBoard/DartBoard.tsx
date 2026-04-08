import { useEffect, useRef } from "react";

import DartBoard from "@/game/DartBoard";

import "./DartBoard.scss";

export default function DartBoardComponent() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (!canvasRef.current) return;

		const dashBoard = new DartBoard();
		dashBoard.init(canvasRef.current);

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
