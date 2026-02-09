import { AppTitle } from './AppTitle';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
	return (
		<header className='Header flex justify-between items-center gap-4 border-b border-mid text-center p-4 w-full'>
			<span />
			<AppTitle />
			<ThemeToggle />
		</header>
	);
}
