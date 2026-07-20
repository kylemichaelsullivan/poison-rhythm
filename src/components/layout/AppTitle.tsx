import { useState } from 'react';
import { focusVisibleRingClassName } from '@/lib/control-classes';
import { Modal } from './Modal';

export function AppTitle() {
	const [open, setOpen] = useState(false);

	return (
		<>
			<h1 className='AppTitle'>
				<button
					type='button'
					className={`text-2xl font-bold rounded-sm transition-colors hover:text-primary ${focusVisibleRingClassName}`}
					aria-haspopup='dialog'
					aria-expanded={open}
					onClick={() => setOpen(true)}
				>
					Poison Rhythm
				</button>
			</h1>
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
		</>
	);
}
