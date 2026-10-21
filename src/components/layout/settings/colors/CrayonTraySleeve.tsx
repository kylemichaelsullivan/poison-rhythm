import type { CrayonId, ThemeContrastScores } from '@/lib/colors';
import { CrayonSwatch, type CrayonSwatchEmphasis } from './CrayonSwatch';

export type CrayonTraySwatchModel = {
	id: CrayonId;
	name: string;
	hex: string;
	emphasis: CrayonSwatchEmphasis;
	scores: ThemeContrastScores;
};

type CrayonTraySleeveProps = {
	label: string;
	swatches: readonly CrayonTraySwatchModel[];
	roleLabel: string;
	partnerRoleLabel: string;
	onSelect: (id: CrayonId) => void;
};

/** One crayon sleeve: tray label + 2×8 swatch grid. */
export function CrayonTraySleeve({
	label,
	swatches,
	roleLabel,
	partnerRoleLabel,
	onSelect,
}: CrayonTraySleeveProps) {
	return (
		<section
			className='CrayonTraySleeve flex flex-col gap-1.5 rounded-lg border border-mid bg-surface-muted p-2'
			aria-label={label}
		>
			<h4 className='text-xs font-semibold uppercase tracking-wide text-muted'>
				{label}
			</h4>
			<div className='grid grid-cols-8 gap-1 max-[380px]:grid-cols-4'>
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
		</section>
	);
}
