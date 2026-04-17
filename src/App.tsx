import { lazy, Suspense, useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Loading from "@/views/Loading/Loading";

const Home = lazy(() => import("./views/Home/Home"));
const Setup = lazy(() => import("./views/Setup/Setup"));
const Game = lazy(() => import("./views/Game/Game"));

import "./App.scss";

const App = () => {
	useEffect(() => {
		document.title = __APP_NAME__;
	}, []);

	return (
		<Router basename={__BASE_URL__}>
			<Suspense fallback={<Loading />}>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/setup" element={<Setup />} />
					<Route path="/game" element={<Game />} />
				</Routes>
			</Suspense>
		</Router>
	);
};

export default App;
