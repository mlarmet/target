import { Line } from "react-chartjs-2";

import { useGameStore } from "@/store/game.store";

import "./Line.scss";

// ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend);

export default function BarStats() {
	const { playerDetails, mode } = useGameStore((state) => state);

	if (!playerDetails) return null;

	const options = {
		responsive: true,
		plugins: {
			legend: { display: false },
		},
		scales: {
			x: {
				ticks: { color: "#e8f5ecff" },
				grid: { color: "#c5dfc9ff" },
				border: { color: "#c5dfc9ff" },
			},
			y: {
				ticks: { color: "#e8f5ecff" },
				grid: { color: "#c5dfc9ff" },
				border: { color: "#c5dfc9ff" },
				min: 0,
				max: mode as number, // max score at start
			},
		},
	};

	const labels = ["Début", ...Object.keys(playerDetails.score).map((_, index) => `T${index + 1}`)];

	const data = {
		labels,
		datasets: [
			{
				label: "Score",
				data: [] as number[],
				borderColor: "#7dde9aff",
				backgroundColor: "#7dde9aff",
				pointHoverBackgroundColor: "#5cc97aff",
			},
		],
	};

	let remainingLastTurn = mode as number;

	const scoreLength = Object.keys(playerDetails.score).length;
	const scoreArray = [remainingLastTurn];

	for (let i = 0; i < scoreLength; i++) {
		if (!playerDetails.score[i] || playerDetails.score[i].length === 0) continue;

		const shots = playerDetails.score[i].map((s) => s.value * Math.floor(s.multiplier));
		const score = shots.reduce((acc, shot) => acc + shot, 0);

		remainingLastTurn -= score;

		scoreArray.push(remainingLastTurn);
	}

	data.datasets[0].data = scoreArray;

	return <Line options={options} data={data} updateMode="resize" redraw height={175} width={350} />;
}
