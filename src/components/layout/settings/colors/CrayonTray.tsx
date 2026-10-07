import {
	type ColorRole,
	CRAYOLA_TRAYS,
	type CrayonId,
	ratePairIfRolePicked,
} from '@/lib/colors';
import { CrayonSwatch, type CrayonSwatchEmphasis } from './CrayonSwatch';

type CrayonTrayProps = {
	role: ColorRole;
	/** Crayon for the role currently being edited. */
	activeId: CrayonId | null;
	/** Crayon for the other role — shown with softer emphasis. */
	partnerId: CrayonId | null;
	/** Hex of the other role — held fixed while previewing each pick. */
	partnerHex: string;
	onSelect: (id: CrayonId) => void;
};

function swatchEmphasis(
	crayonId: CrayonId,
	activeId: CrayonId | null,
	partnerId: CrayonId | null,
): CrayonSwatchEmphasis {
	if (activeId != null && crayonId === activeId) {
		return 'active';
	}
	if (partnerId != null && crayonId === partnerId) {
		return 'partner';
	}
	return 'none';
}

export function CrayonTray({
	role,
	activeId,
	partnerId,
	partnerHex,
	onSelect,
}: CrayonTrayProps) {
	const roleLabel = role === 'dominant' ? 'Dominant' : 'Secondary';
	const partnerRoleLabel = role === 'dominant' ? 'Secondary' : 'Dominant';

	return (
		<fieldset className='CrayonTray flex min-w-0 flex-col gap-3 border-0 p-0'>
			<legend className='sr-only'>
				Crayon Colors — each badge is the WCAG pair grade if chosen as{' '}
				{roleLabel}. Current {roleLabel} is emphasized; current{' '}
				{partnerRoleLabel} is marked more lightly.
			</legend>
			{/*
			 * Physical Crayola box is landscape with four sleeves side-by-side.
			 * Portrait UI stacks the four sleeves; each sleeve keeps the
			 * familiar 2×8 face (16 squares).
			 */}
			{CRAYOLA_TRAYS.map((tray) => (
				<section
					key={tray.id}
					className='CrayonTraySleeve flex flex-col gap-1.5 rounded-lg border border-mid bg-surface-muted p-2 shadow-soft'
					aria-label={tray.label}
				>
					<h4 className='text-xs font-semibold uppercase tracking-wide text-muted'>
						{tray.label}
					</h4>
					<div className='grid grid-cols-8 gap-1 max-[380px]:grid-cols-4'>
						{tray.crayons.map((crayon) => {
							const rating = ratePairIfRolePicked(crayon.hex, role, partnerHex);
							const emphasis = swatchEmphasis(crayon.id, activeId, partnerId);
							return (
								<CrayonSwatch
									key={crayon.id}
									name={crayon.name}
									hex={crayon.hex}
									emphasis={emphasis}
									grade={rating.grade}
									ratio={rating.ratio}
									roleLabel={roleLabel}
									partnerRoleLabel={
										emphasis === 'partner' ? partnerRoleLabel : undefined
									}
									onSelect={() => onSelect(crayon.id)}
								/>
							);
						})}
					</div>
				</section>
			))}
		</fieldset>
	);
}
