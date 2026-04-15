import { useEffect } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Home from "@/views/Home/Home";
import Setup from "@/views/Setup/Setup";

import "./App.scss";

const App = () => {
	useEffect(() => {
		document.title = __APP_NAME__;
	}, []);

	return (
		<Router basename={__BASE_URL__}>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/setup" element={<Setup />} />
				{/* Fallback route to home */}
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</Router>
	);
};

export default App;
