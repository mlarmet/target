import { useNavigate } from "react-router";

import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";

import dartboard from "@/assets/images/dartboard.svg";

import "./Home.scss";

export default function Home() {
	const navigate = useNavigate();

	return (
		<>
			<Header />
			<main id="home">
				<div id="left">
					<div id="box">
						<h1 className="title main">{__APP_NAME__}</h1>
						<p>
							Bienvenue sur cette application révolutionnaire !<br />
							Qui permet de... compter les points aux fléchettes !
						</p>

						<button className="btn" onClick={() => navigate("/setup")}>
							Nouvelle partie
						</button>
					</div>
				</div>
				<div id="right">
					<div id="devise">
						<h1 className="title main">Vise.</h1>
						<h1 className="title main">Lance.</h1>
						<h1 className="title main">Domine.</h1>
					</div>

					<img id="decoration" src={dartboard} alt="decoration" />
				</div>
			</main>
			<Footer />
		</>
	);
}
