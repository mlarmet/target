import dartboard from "@/assets/images/dartboard.svg";

import "./Loading.scss";

export default function Loading() {
	return (
		<div id="loader" className="">
			<img id="decoration" src={dartboard} alt="decoration" />
		</div>
	);
}
