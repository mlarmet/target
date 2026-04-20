import "./Footer.scss";

interface FooterProps {
	reverse?: boolean;
}

export default function Footer({ reverse }: FooterProps) {
	const formatDate = (dateStr: string) => {
		if (!dateStr) return "";

		const date = new Date(dateStr);

		// Format data to DD/MM/YYYY - HH:MM:SS
		return new Intl.DateTimeFormat("fr-FR", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: false,
		}).format(date);
	};
	return (
		<footer className={reverse ? "reverse" : ""}>
			<div id="infos">
				<p id="author">
					<a className="link" target="_blank" href="https://mlarmet.github.io/">
						Maxence LARMET
					</a>
				</p>
				<p id="build-date">
					v{__BUILD_INFOS__.version} - {formatDate(__BUILD_INFOS__.date)}
				</p>
			</div>
		</footer>
	);
}
