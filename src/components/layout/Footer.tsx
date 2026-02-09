export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className='Footer border-t border-mid text-center p-4 w-full'>
			&copy; {currentYear} Poison Rhythm
		</footer>
	);
}
