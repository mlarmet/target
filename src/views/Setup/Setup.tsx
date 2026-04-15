import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";

import "./Setup.scss";

export default function Setup() {
	return (
		<>
			<Header reverse />
			<main id="setup">
				<h1 className="title main">Setup</h1>
			</main>
			<Footer />
		</>
	);
}
