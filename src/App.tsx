import { lazy, Suspense, useEffect } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

const Home = lazy(() => import("./views/Home/Home"));
const Setup = lazy(() => import("./views/Setup/Setup"));
const Game = lazy(() => import("./views/Game/Game"));

import "./App.scss";
import Loading from "./views/Loading/Loading";

const App = () => {
	useEffect(() => {
		document.title = __APP_NAME__;
	}, []);

	const router = createBrowserRouter(
		[
			{ path: "/", element: <Home /> },
			{ path: "/setup", element: <Setup /> },
			{ path: "/game", element: <Game /> },
			{ path: "*", element: <Navigate replace to="/" /> },
		],
		{ basename: __BASE_URL__ },
	);

	return (
		<Suspense fallback={<Loading />}>
			<RouterProvider router={router} />
		</Suspense>
	);
};

export default App;
