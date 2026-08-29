import type { ReactNode } from 'react';
import { useCallback, useState } from 'react';
import { Modal } from '../Modal';
import { AboutPoisonRhythmContext } from './AboutPoisonRhythmContext';

export function AboutPoisonRhythmProvider({
	children,
}: {
	children: ReactNode;
}) {
	const [open, setOpen] = useState(false);
	const openAbout = useCallback(() => setOpen(true), []);

	return (
		<AboutPoisonRhythmContext.Provider value={{ open, openAbout }}>
			{children}
			<Modal
				open={open}
				ariaLabel='About Poison Rhythm'
				onClose={() => setOpen(false)}
			>
				<div className='flex flex-col items-center gap-3 pt-1'>
					<img
						src='/apple-touch-icon.png'
						alt=''
						width={72}
						height={72}
						className='size-18 rounded-xl'
					/>
					<h2 className='AppTitleBrand text-2xl font-bold tracking-tight'>
						Poison Rhythm
					</h2>
					<p className='text-sm text-mid tabular-nums'>
						Version {__APP_VERSION__}
					</p>
				</div>
			</Modal>
		</AboutPoisonRhythmContext.Provider>
	);
}
