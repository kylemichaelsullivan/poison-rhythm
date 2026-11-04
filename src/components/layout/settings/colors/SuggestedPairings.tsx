import {
	pairingMatchesSelection,
	resolveAccentDisplay,
	SUGGESTED_PAIRINGS,
} from '@/lib/colors';
import { SuggestedPairingRow } from './SuggestedPairingRow';
import type { ColorPairing } from '@/lib/colors';
import type { ColorPreference } from '@/lib/preference-schemas';

type SuggestedPairingsProps = {
	dominantColor: ColorPreference;
	secondaryColor: ColorPreference;
	onApply: (pairing: ColorPairing) => void;
};

/** Curated pairs; apply handler writes preferences in the Colors composer. */
export function SuggestedPairings({
	dominantColor,
	secondaryColor,
	onApply,
}: SuggestedPairingsProps) {
	return (
		<div className='SuggestedPairings flex flex-col gap-2'>
			<ul className='flex flex-col gap-2'>
				{SUGGESTED_PAIRINGS.map((pairing) => {
					const selected = pairingMatchesSelection(
						pairing,
						dominantColor,
						secondaryColor,
					);
					const dominant = resolveAccentDisplay(pairing.dominantId, 'dominant');
					const secondary = resolveAccentDisplay(
						pairing.secondaryId,
						'secondary',
					);
					return (
						<li key={pairing.id}>
							<SuggestedPairingRow
								pairing={pairing}
								dominantHex={dominant.hex}
								secondaryHex={secondary.hex}
								selected={selected}
								onApply={() => onApply(pairing)}
							/>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
