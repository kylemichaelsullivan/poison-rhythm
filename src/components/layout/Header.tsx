import clsx from 'clsx';
import {
	appChromeBarClassName,
	appChromeBarHeaderClassName,
} from '@/lib/control-classes';
import { AppTitle, ShowNotes } from '.';
import { ActionButton } from './button';

export function Header() {
	return (
		<header
			className={clsx(
				'Header border-b-4 border-secondary bg-primary text-on-primary',
				appChromeBarClassName,
				appChromeBarHeaderClassName,
			)}
		>
			<div className='justify-self-start'>
				<ShowNotes />
			</div>
			<AppTitle />
			<div className='justify-self-end'>
				<ActionButton />
			</div>
		</header>
	);
}
