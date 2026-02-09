import { faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
	const { effectiveTheme, setTheme } = useTheme();
	const label =
		effectiveTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';

	return (
		<button
			type='button'
			className='ThemeToggle border border-mid rounded bg-dark text-white p-2 transition hover:bg-mid'
			onClick={() => setTheme(effectiveTheme === 'dark' ? 'light' : 'dark')}
			title={label}
			aria-label={label}
		>
			<FontAwesomeIcon icon={faLightbulb} />
		</button>
	);
}
