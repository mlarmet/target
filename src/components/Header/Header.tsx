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
		</header>
	);
}
