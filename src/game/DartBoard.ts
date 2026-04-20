import { GameEngine } from "./GameEngine";

const SEGMENTS = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

const RING_SIZE = 0.11;

const STROKE_WIDTH = 4;

const BOARD_RATIO = {
	numberRadius: 0.9,

	doubleOuter: 0.8,

	tripleOuter: 0.5,

	bullOuter: 0.15,
	bullInner: 0.063,
};

export default class DartBoard {
	private canvas?: HTMLCanvasElement;
	private ctx?: CanvasRenderingContext2D;

	private size: number;
	private selectedSegment: Segment;

	private DPR = window.devicePixelRatio || 1;

	private colors: Record<TileColor, string>;

	private fontPromise: Promise<void>;

	private font = {
		weight: 500,
		family: "Barlow",
	};

	constructor() {
		this.size = 1;
		this.selectedSegment = { value: -1, multiplier: 1 };

		this.colors = {
			selected: "",
			red: "",
			green: "",
			white: "",
			black: "",
			text: "",
		};

		this.handleClick = this.handleClick.bind(this);
		this.resize = this.resize.bind(this);

		this.fontPromise = (async () => {
			await document.fonts.load(`${this.font.weight} 16px "${this.font.family}"`);
			await document.fonts.ready;
		})();
	}

	init(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext("2d")!;

		this.canvas.addEventListener("click", this.handleClick);

		this.SetColors();
	}

	SetColors() {
		const root = document.documentElement;
		const rootStyle = getComputedStyle(root);

		Object.keys(this.colors).forEach((color) => {
			const colorValue = rootStyle.getPropertyValue(`--color-tiles-${color}`);
			this.colors[color as TileColor] = colorValue;
		});
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

		// const nx = dx / radius;
		// const ny = dy / radius;

		this.selectedSegment = res; //{ value: res.value, multiplier: res.multiplier, x: nx, y: ny };

		GameEngine.shot(res);

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
		const value = SEGMENTS[segmentIndex];
		let multiplier: 1 | 1.5 | 2 | 3 = 1;

		if (r >= rDoubleOuter) return { value: 0, multiplier: 1 };
		else if (r >= rTripleOuter && r <= rDoubleInner) multiplier = 1.5;
		else if (r <= rBullInner) return { value: 25, multiplier: 2 };
		else if (r <= rBullOuter) return { value: 25, multiplier: 1 };
		else if (r >= rTripleInner && r <= rTripleOuter) multiplier = 3;
		else if (r >= rDoubleInner && r <= rDoubleOuter) multiplier = 2;

		return { value, multiplier };
	}

	async resize() {
		if (!this.canvas || !this.ctx) return;

		const container = document.getElementById("board-container")!;

		this.size = Math.min(container.clientWidth, container.clientHeight) * 0.9;

		this.canvas.style.width = `${this.size}px`;
		this.canvas.style.height = `${this.size}px`;

		this.DPR = window.devicePixelRatio || 1;

		this.canvas.width = this.size * this.DPR;
		this.canvas.height = this.size * this.DPR;

		this.ctx.setTransform(this.DPR, 0, 0, this.DPR, 0, 0);

		await this.fontPromise;

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

		this.ctx.strokeStyle = this.colors.text;
		this.ctx.lineWidth = this.DPR === 1 ? STROKE_WIDTH - 2 : STROKE_WIDTH / this.DPR;
		this.ctx.stroke();
	}

	drawStroke(x: number, y: number, r: number, color: string) {
		if (!this.canvas || !this.ctx) return;

		this.ctx.beginPath();

		this.ctx.arc(x, y, r, 0, Math.PI * 2);

		this.ctx.closePath();

		this.ctx.strokeStyle = color;
		this.ctx.lineWidth = this.DPR === 1 ? STROKE_WIDTH - 2 : STROKE_WIDTH / this.DPR;
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
		const center = this.size / 2.0;
		const radius = this.size / 2.0;

		return {
			center,
			radius,
			angleStep: (Math.PI * 2) / SEGMENTS.length,

			rDoubleOuter: radius * BOARD_RATIO.doubleOuter,
			rDoubleInner: radius * (BOARD_RATIO.doubleOuter - RING_SIZE),

			rTripleOuter: radius * BOARD_RATIO.tripleOuter,
			rTripleInner: radius * (BOARD_RATIO.tripleOuter - RING_SIZE),

			rBullOuter: radius * BOARD_RATIO.bullOuter,
			rBullInner: radius * BOARD_RATIO.bullInner,

			rNumberCenter: radius * BOARD_RATIO.numberRadius,
		};
	}

	redraw() {
		this.selectedSegment = { value: -1, multiplier: 1 };
		this.draw();
	}

	draw() {
		if (!this.canvas || !this.ctx) return;

		this.ctx.clearRect(0, 0, this.size, this.size);

		const { center, radius, angleStep, rDoubleOuter, rDoubleInner, rTripleOuter, rTripleInner, rBullOuter, rBullInner, rNumberCenter } =
			this.getInnerOuterRadius();

		this.drawCircle(center, center, radius, this.colors.black);

		for (let i = 0; i < SEGMENTS.length; i++) {
			const start = -Math.PI / 2 - angleStep / 2 + i * angleStep;
			const end = start + angleStep;

			const isEven = i % 2 === 0;
			let lowBaseColor = isEven ? this.colors.black : this.colors.white;
			let upBaseColor = lowBaseColor;
			let tripleRingColor = isEven ? this.colors.red : this.colors.green;
			let doubleRingColor = tripleRingColor;

			const textColor = this.colors.text;

			if (SEGMENTS[i] === this.selectedSegment.value) {
				// textColor = this.colors.selected;

				switch (this.selectedSegment.multiplier) {
					case 1:
						lowBaseColor = this.colors.selected;
						break;
					case 1.5:
						upBaseColor = this.colors.selected;
						break;
					case 2:
						doubleRingColor = this.colors.selected;
						break;
					case 3:
						tripleRingColor = this.colors.selected;
						break;
					default:
						break;
				}
			}

			// --- big base segment
			this.drawArc(center, center, rDoubleInner, rTripleOuter, start, end, upBaseColor);
			// --- base segment
			this.drawArc(center, center, rTripleInner, rBullOuter, start, end, lowBaseColor);
			// --- double ring
			this.drawArc(center, center, rDoubleInner, rDoubleOuter, start, end, doubleRingColor);
			// --- triple ring
			this.drawArc(center, center, rTripleInner, rTripleOuter, start, end, tripleRingColor);

			this.ctx.fillStyle = textColor;
			this.ctx.font = `${this.font.weight} ${this.size * 0.05}px "${this.font.family}"`;
			this.ctx.textAlign = "center";
			this.ctx.textBaseline = "middle";

			const angle = -Math.PI / 2 + i * angleStep;

			const x = center + Math.cos(angle) * rNumberCenter;
			const y = center + Math.sin(angle) * rNumberCenter;

			this.ctx.fillText(String(SEGMENTS[i]), x, y);
		}

		//  --- small bull
		let smallBullColor = this.colors.green;

		if (this.selectedSegment.value === 25 && this.selectedSegment.multiplier === 1) {
			smallBullColor = this.colors.selected;
		}

		this.drawCircle(center, center, rBullOuter, smallBullColor);
		this.drawStroke(center, center, rBullOuter, this.colors.text);

		//  --- big bull
		let bigBullColor = this.colors.red;

		if (this.selectedSegment.value === 25 && this.selectedSegment.multiplier === 2) {
			bigBullColor = this.colors.selected;
		}

		this.drawCircle(center, center, rBullInner, bigBullColor);
		this.drawStroke(center, center, rBullInner, this.colors.text);

		// hit marker
		// const px = center + this.selectedSegment.x * radius;
		// const py = center + this.selectedSegment.y * radius;

		// this.drawCircle(px, py, radius * 0.02, "red");
	}
}
