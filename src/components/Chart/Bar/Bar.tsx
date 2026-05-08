import { Bar } from "react-chartjs-2";

import { useGameStore } from "@/store/game.store";

import "./Bar.scss";

export default function BarStats() {
	const { playerDetails } = useGameStore((state) => state);

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
				ticks: { color: "#e8f5ecff", stepSize: 30 },
				grid: { color: "#c5dfc9ff" },
				border: { color: "#c5dfc9ff" },
				min: 0,
				max: 180, // max value 3 * T20
			},
		},
	};

	const labels = Object.keys(playerDetails.score).map((_, index) => `T${index + 1}`);

	const data = {
		labels,
		datasets: [
			{
				label: "Score",
				data: [] as number[],
				backgroundColor: "#7dde9aff",
				hoverBackgroundColor: "#5cc97aff",
			},
		],
	};

	const scoreArray = [];

	const scoreLength = Object.keys(playerDetails.score).length;

	for (let i = 0; i < scoreLength; i++) {
		if (!playerDetails.score[i] || playerDetails.score[i].length === 0) continue;

		const shots = playerDetails.score[i].map((s) => s.value * Math.floor(s.multiplier));
		const score = shots.reduce((acc, shot) => acc + shot, 0);

		scoreArray.push(score);
	}

	data.datasets[0].data = scoreArray;

	return <Bar options={options} data={data} updateMode="resize" redraw height={175} width={350} />;
}
