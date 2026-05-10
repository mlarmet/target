import "./Header.scss";

interface HeaderProps {
	reverse?: boolean;
}

export default function Header({ reverse }: HeaderProps) {
	return (
		<header className={reverse ? "reverse" : ""}>
			<h1 id="app-name" className="title main">
				{__APP_NAME__}
			</h1>

			{window.location.pathname !== __BASE_URL__ && (
				<button type="button" id="back-btn" className="btn tertiary" onClick={() => history.back()}>
					<span className="material-symbols-outlined">arrow_left</span>
					Retour
				</button>
			)}
		</header>
	);
}
