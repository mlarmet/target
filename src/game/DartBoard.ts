const SEGMENTS = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

const RING_SIZE = 0.09;

const STROKE_WIDTH = 4;

const BOARD_RATIO = {
	numberRadius: 0.89,

	doubleOuter: 0.8,

	tripleOuter: 0.5,

	bullOuter: 0.15,
	bullInner: 0.07,
};

export default class DartBoard {
	private canvas?: HTMLCanvasElement;
	private ctx?: CanvasRenderingContext2D;

	private size: number;
	private selectedSegment: { value: number; multiplier: number };

	private DPR = window.devicePixelRatio || 1;

	constructor() {
		this.size = 1;
		this.selectedSegment = { value: -1, multiplier: 0 };

		this.handleClick = this.handleClick.bind(this);
		this.resize = this.resize.bind(this);
	}

	init(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext("2d")!;

		// Listen for mouse moves
		this.canvas.addEventListener("click", this.handleClick);
	}

	handleClick = (e: MouseEvent) => {
		if (!this.canvas || !this.ctx) return;

		const rect = this.canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const { center } = this.getInnerOuterRadius();

		const dx = x - center;
		const dy = y - center;

		const res = this.getBoxValue(dx, dy);
		this.selectedSegment = res;

		this.draw();
	};

	getBoxValue(dx: number, dy: number) {
		const r = Math.sqrt(dx * dx + dy * dy);

		const { angleStep, rDoubleOuter, rDoubleInner, rTripleOuter, rTripleInner, rBullOuter, rBullInner } = this.getInnerOuterRadius();
		let angle = Math.atan2(dy, dx);

		// --- ajustement pour centrer 20 en haut
		angle += Math.PI / 2 + Math.PI * 2 + angleStep / 2;
		if (angle < 0) angle += Math.PI * 2;

		const segmentIndex = Math.floor(angle / angleStep) % SEGMENTS.length;
		let value = SEGMENTS[segmentIndex];
		let multiplier: 1 | 2 | 3 = 1;

		if (r <= rBullInner) {
			value = 25;
			multiplier = 2;
		} else if (r <= rBullOuter) {
			value = 25;
			multiplier = 1;
		} else if (r >= rTripleInner && r <= rTripleOuter) multiplier = 3;
		else if (r >= rDoubleInner && r <= rDoubleOuter) multiplier = 2;

		return { value, multiplier };
	}

	resize() {
		if (!this.canvas || !this.ctx) return;

		const container = document.getElementById("board-container")!;

		this.size = Math.min(container.clientWidth, container.clientHeight) * 0.9;

		this.canvas.style.width = `${this.size}px`;
		this.canvas.style.height = `${this.size}px`;

		this.DPR = window.devicePixelRatio || 1;

		this.canvas.width = this.size * this.DPR;
		this.canvas.height = this.size * this.DPR;

		this.ctx.setTransform(this.DPR, 0, 0, this.DPR, 0, 0);

		this.draw();
	}

	drawArc(cx: number, cy: number, innerR: number, outerR: number, start: number, end: number, color: string) {
		if (!this.canvas || !this.ctx) return;

		this.ctx.beginPath();

		this.ctx.arc(cx, cy, outerR, start, end);
		this.ctx.arc(cx, cy, innerR, end, start, true);

		this.ctx.closePath();

		this.ctx.fillStyle = color;
		this.ctx.fill();

		this.ctx.strokeStyle = "#000";
		this.ctx.lineWidth = STROKE_WIDTH;
		this.ctx.lineCap = "round";
		this.ctx.stroke();
	}

	drawStroke(x: number, y: number, r: number, lineWidth: number, color: string) {
		if (!this.canvas || !this.ctx) return;

		this.ctx.beginPath();

		this.ctx.arc(x, y, r, 0, Math.PI * 2);

		this.ctx.closePath();

		this.ctx.strokeStyle = color;
		this.ctx.lineWidth = lineWidth;
		this.ctx.stroke();
	}

	drawCircle(x: number, y: number, r: number, color: string) {
		if (!this.canvas || !this.ctx) return;

		this.ctx.beginPath();

		this.ctx.arc(x, y, r, 0, Math.PI * 2);

		this.ctx.closePath();

		this.ctx.fillStyle = color;
		this.ctx.fill();
	}

	getInnerOuterRadius() {
		const center = this.size / 2;
		const radius = this.size / 2;

		return {
			center,
			radius,
			angleStep: (Math.PI * 2) / SEGMENTS.length,

			rDoubleOuter: radius * BOARD_RATIO.doubleOuter,
			rDoubleInner: radius * BOARD_RATIO.doubleOuter - radius * RING_SIZE,

			rTripleOuter: radius * BOARD_RATIO.tripleOuter,
			rTripleInner: radius * BOARD_RATIO.tripleOuter - radius * RING_SIZE,

			rBullOuter: radius * BOARD_RATIO.bullOuter,
			rBullInner: radius * BOARD_RATIO.bullInner,

			rNumberCenter: radius * BOARD_RATIO.numberRadius,
		};
	}

	draw() {
		if (!this.canvas || !this.ctx) return;

		this.ctx.clearRect(0, 0, this.size, this.size);

		const { center, radius, angleStep, rDoubleOuter, rDoubleInner, rTripleOuter, rTripleInner, rBullOuter, rBullInner, rNumberCenter } =
			this.getInnerOuterRadius();

		for (let i = 0; i < SEGMENTS.length; i++) {
			const start = -Math.PI / 2 - angleStep / 2 + i * angleStep;
			const end = start + angleStep;

			const isEven = i % 2 === 0;
			let baseColor = isEven ? "#111" : "#f5f5f5";
			let tripleRingColor = isEven ? "#c40000" : "#0a8f2a";
			let doubleRingColor = isEven ? "#c40000" : "#0a8f2a";

			let textColor = "#fff";

			if (SEGMENTS[i] === this.selectedSegment.value) {
				textColor = "#1f35de";

				switch (this.selectedSegment.multiplier) {
					case 1:
						baseColor = "#1f35de";
						break;
					case 2:
						doubleRingColor = "#1f35de";
						break;
					case 3:
						tripleRingColor = "#1f35de";
						break;
					default:
						break;
				}
			}

			// --- big base segment
			this.drawArc(center, center, rTripleOuter, rDoubleInner, start, end, baseColor);
			// --- base segment
			this.drawArc(center, center, rDoubleInner, rBullOuter, start, end, baseColor);
			// --- double ring
			this.drawArc(center, center, rDoubleInner, rDoubleOuter, start, end, doubleRingColor);
			// --- triple ring
			this.drawArc(center, center, rTripleInner, rTripleOuter, start, end, tripleRingColor);

			this.ctx.fillStyle = textColor;
			this.ctx.font = `${this.size * 0.045}px Arial`;
			this.ctx.textAlign = "center";
			this.ctx.textBaseline = "middle";

			const angle = -Math.PI / 2 + i * angleStep;

			const x = center + Math.cos(angle) * rNumberCenter;
			const y = center + Math.sin(angle) * rNumberCenter;

			this.ctx.fillText(String(SEGMENTS[i]), x, y);
		}

		// --- extern border
		this.drawStroke(center, center, radius * 0.99, STROKE_WIDTH, "#fff");

		//  --- small bull
		let smallBullColor = "#0a8f2a";

		if (this.selectedSegment.value === 25 && this.selectedSegment.multiplier === 1) {
			smallBullColor = "#1f35de";
		}

		this.drawCircle(center, center, rBullOuter, smallBullColor);
		this.drawStroke(center, center, rBullOuter, STROKE_WIDTH, "#000");

		//  --- big bull
		let bigBullColor = "#c40000";

		if (this.selectedSegment.value === 25 && this.selectedSegment.multiplier === 2) {
			bigBullColor = "#1f35de";
		}

		this.drawCircle(center, center, rBullInner, bigBullColor);
		this.drawStroke(center, center, rBullInner, STROKE_WIDTH, "#000");
	}
}
