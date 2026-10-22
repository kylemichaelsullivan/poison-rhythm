import { memo, useMemo } from 'react';
import {
	type ColorRole,
	CRAYOLA_TRAYS,
	type CrayonId,
	isBrandAccentId,
	ratePaletteIfRolePicked,
	type ThemeContrastScores,
} from '@/lib/colors';
import type { ColorPreference } from '@/lib/preference-schemas';
import type { CrayonSwatchEmphasis } from './CrayonSwatch';
import {
	CrayonTraySleeve,
	type CrayonTraySwatchModel,
} from './CrayonTraySleeve';

type CrayonTrayProps = {
	role: ColorRole;
	activeId: ColorPreference;
	partnerId: ColorPreference;
	partnerHex: string;
	roleLabel: string;
	partnerRoleLabel: string;
	onSelect: (id: CrayonId) => void;
};

function swatchEmphasis(
	crayonId: CrayonId,
	activeId: ColorPreference,
	partnerId: ColorPreference,
): CrayonSwatchEmphasis {
	if (activeId != null && !isBrandAccentId(activeId) && crayonId === activeId) {
		return 'active';
	}
	if (
		partnerId != null &&
		!isBrandAccentId(partnerId) &&
		crayonId === partnerId
	) {
		return 'partner';
	}
	return 'none';
}

/**
 * Crayon sleeves. Scores memoize on role + partner hex (theme taps / active
 * selection alone do not rescore all 64 crayons).
 */
export const CrayonTray = memo(function CrayonTray({
	role,
	activeId,
	partnerId,
	partnerHex,
	roleLabel,
	partnerRoleLabel,
	onSelect,
}: CrayonTrayProps) {
	const scoresById = useMemo(() => {
		const map = new Map<CrayonId, ThemeContrastScores>();
		for (const tray of CRAYOLA_TRAYS) {
			for (const crayon of tray.crayons) {
				map.set(
					crayon.id,
					ratePaletteIfRolePicked(crayon.hex, role, partnerHex),
				);
			}
		}
		return map;
	}, [role, partnerHex]);

	const sleeves = useMemo(
		() =>
			CRAYOLA_TRAYS.map((tray) => {
				const swatches: CrayonTraySwatchModel[] = tray.crayons.map(
					(crayon) => ({
						id: crayon.id,
						name: crayon.name,
						hex: crayon.hex,
						emphasis: swatchEmphasis(crayon.id, activeId, partnerId),
						scores: scoresById.get(crayon.id) as ThemeContrastScores,
					}),
				);
				return { id: tray.id, label: tray.label, swatches };
			}),
		[scoresById, activeId, partnerId],
	);

	const handleSelect = (id: CrayonId) => {
		if (id === activeId) {
			return;
		}
		onSelect(id);
	};

	return (
		<fieldset className='CrayonTray flex min-w-0 flex-col gap-3 border-0 p-0'>
			<legend className='sr-only'>
				Crayon Colors — each swatch shows a Light Mode grade and a Dark Mode
				grade if chosen as {roleLabel}. Light sits on top in every theme.
				Current {roleLabel} is emphasized; current {partnerRoleLabel} is marked
				more lightly. Prefer A or B in both modes.
			</legend>
			{sleeves.map((sleeve) => (
				<CrayonTraySleeve
					key={sleeve.id}
					label={sleeve.label}
					swatches={sleeve.swatches}
					roleLabel={roleLabel}
					partnerRoleLabel={partnerRoleLabel}
					onSelect={handleSelect}
				/>
			))}
		</fieldset>
	);
});
