import clsx from 'clsx';
import type { ColorPairing } from '@/lib/colors';
import {
	interactiveInsetChromeClassName,
	selectionOutlineActiveClassName,
} from '@/lib/control-classes';
import { SelectionCheckMark } from './SelectionCheckMark';

type SuggestedPairingRowProps = {
	pairing: ColorPairing;
	dominantHex: string;
	secondaryHex: string;
	selected: boolean;
	onApply: () => void;
};

/** Dual-swatch pairing button for Suggested Pairings. */
export function SuggestedPairingRow({
	pairing,
	dominantHex,
	secondaryHex,
	selected,
	onApply,
}: SuggestedPairingRowProps) {
	return (
		<button
			type='button'
			className={clsx(
				'SuggestedPairing relative flex w-full items-center gap-3 rounded-lg border-2 px-3 py-2 text-left transition-[colors,box-shadow,outline-color]',
				interactiveInsetChromeClassName,
				selected
					? ['border-black bg-primary/10 z-10', selectionOutlineActiveClassName]
					: 'border-mid bg-surface-muted',
				pairing.recommended && !selected && 'border-primary/40',
			)}
			aria-pressed={selected}
			data-chrome-active={selected || undefined}
			onClick={onApply}
		>
			<span
				className={clsx(
					'relative flex shrink-0 overflow-hidden rounded-full border-2 border-black',
					selected && selectionOutlineActiveClassName,
				)}
				aria-hidden='true'
			>
				<span
					className='block h-8 w-5'
					style={{ backgroundColor: dominantHex }}
				/>
				<span
					className='block h-8 w-5'
					style={{ backgroundColor: secondaryHex }}
				/>
			</span>
			<span className='flex min-w-0 flex-1 flex-col gap-0.5'>
				<span className='text-sm font-medium text-dark'>
					{pairing.label}
					{pairing.recommended ? ' · Default' : ''}
				</span>
				<span className='text-xs text-dark'>{pairing.caption}</span>
			</span>
			{selected ? <SelectionCheckMark size='md' position='inline' /> : null}
		</button>
	);
}
