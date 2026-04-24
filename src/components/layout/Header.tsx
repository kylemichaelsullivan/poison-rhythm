import { AppTitle, ShowNotes, ThemeToggle } from '.';

export function Header() {
	return (
		<header className='Header flex justify-between items-center gap-4 border-b border-mid text-center p-4 w-full'>
			<ShowNotes />
			<AppTitle />
			<ThemeToggle />
		</header>
	);
}
