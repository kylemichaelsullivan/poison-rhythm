export function Copyright() {
	const currentYear = new Date().getFullYear();

	return (
		<span
			className='Copyright select-none'
			title={`Poison Rhythm v${__APP_VERSION__}`}
		>
			&copy; {currentYear} Poison Rhythm
		</span>
	);
}
