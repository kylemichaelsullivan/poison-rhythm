import { CrayonSwatch } from './CrayonSwatch';
import type { CrayonId, ThemeContrastScores } from '@/lib/colors';
import type { CrayonSwatchEmphasis } from './CrayonSwatch';

export type CrayonTraySwatchModel = {
	id: CrayonId;
	name: string;
	hex: string;
	emphasis: CrayonSwatchEmphasis;
	scores: ThemeContrastScores;
};

type CrayonTraySleeveProps = {
	swatches: readonly CrayonTraySwatchModel[];
	roleLabel: string;
	partnerRoleLabel: string;
	onSelect: (id: CrayonId) => void;
};

/** One crayon sleeve: 2×8 swatch grid. */
export function CrayonTraySleeve({
	swatches,
	roleLabel,
	partnerRoleLabel,
	onSelect,
}: CrayonTraySleeveProps) {
	return (
		<div className='CrayonTraySleeve rounded-lg border border-mid bg-surface-muted p-2'>
			<div className='grid grid-cols-8 gap-1 max-tray:grid-cols-4'>
				{swatches.map((swatch) => (
					<CrayonSwatch
						key={swatch.id}
						name={swatch.name}
						hex={swatch.hex}
						emphasis={swatch.emphasis}
						scores={swatch.scores}
						roleLabel={roleLabel}
						partnerRoleLabel={
							swatch.emphasis === 'partner' ? partnerRoleLabel : undefined
						}
						onSelect={() => onSelect(swatch.id)}
					/>
				))}
			</div>
		</div>
	);
}
