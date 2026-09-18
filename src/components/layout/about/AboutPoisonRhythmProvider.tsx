import type { ReactNode } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { DifficultyControls } from '@/components/controls';
import { usePendingDifficulty } from '@/contexts';
import { Modal } from '../Modal';
import { AboutPoisonRhythmContext } from './AboutPoisonRhythmContext';

export function AboutPoisonRhythmProvider({
	children,
}: {
	children: ReactNode;
}) {
	const [open, setOpen] = useState(false);
	const { onHostModalClosed } = usePendingDifficulty();
	const openAbout = useCallback(() => setOpen(true), []);
	const closeAbout = useCallback(() => {
		setOpen(false);
		onHostModalClosed();
	}, [onHostModalClosed]);

	const value = useMemo(() => ({ open, openAbout }), [open, openAbout]);

	return (
		<AboutPoisonRhythmContext.Provider value={value}>
			{children}
			<Modal
				open={open}
				size='md'
				ariaLabel='About Poison Rhythm'
				onClose={closeAbout}
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
					<p className='text-sm text-muted tabular-nums'>
						Version {__APP_VERSION__}
					</p>
				</div>
				<div className='mt-2 w-full border-t border-primary/20 pt-4'>
					<DifficultyControls />
				</div>
			</Modal>
		</AboutPoisonRhythmContext.Provider>
	);
}
