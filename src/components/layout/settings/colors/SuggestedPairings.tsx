import clsx from 'clsx';
import {
	BRAND_DOMINANT_HEX,
	BRAND_SECONDARY_HEX,
	type ColorPairing,
	type CrayonId,
	crayonByIdOrNull,
	pairingMatchesSelection,
} from '@/lib/colors';
import { focusVisibleRingClassName } from '@/lib/control-classes';

type SuggestedPairingsProps = {
	pairings: readonly ColorPairing[];
	dominantId: CrayonId | null;
	secondaryId: CrayonId | null;
	onApply: (pairing: ColorPairing) => void;
};

function pairingSwatchHex(id: CrayonId | null, fallback: string): string {
	return crayonByIdOrNull(id)?.hex ?? fallback;
}

export function SuggestedPairings({
	pairings,
	dominantId,
	secondaryId,
	onApply,
}: SuggestedPairingsProps) {
	return (
		<div className='SuggestedPairings flex flex-col gap-2'>
			<ul className='flex flex-col gap-2'>
				{pairings.map((pairing) => {
					const selected = pairingMatchesSelection(
						pairing,
						dominantId,
						secondaryId,
					);
					const dominantHex = pairingSwatchHex(
						pairing.dominantId,
						BRAND_DOMINANT_HEX,
					);
					const secondaryHex = pairingSwatchHex(
						pairing.secondaryId,
						BRAND_SECONDARY_HEX,
					);

					return (
						<li key={pairing.id}>
							<button
								type='button'
								className={clsx(
									'SuggestedPairing flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors',
									focusVisibleRingClassName,
									selected
										? 'border-primary bg-primary/10 shadow-soft'
										: 'border-mid bg-surface-muted hover:border-primary',
									pairing.recommended && !selected && 'border-primary/40',
								)}
								aria-pressed={selected}
								onClick={() => onApply(pairing)}
							>
								<span
									className='flex shrink-0 overflow-hidden rounded-full border border-mid'
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
								<span className='flex min-w-0 flex-col gap-0.5'>
									<span className='text-sm font-medium text-dark'>
										{pairing.label}
										{pairing.recommended ? ' · Recommended' : ''}
									</span>
									<span className='text-xs text-dark'>{pairing.caption}</span>
								</span>
							</button>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
