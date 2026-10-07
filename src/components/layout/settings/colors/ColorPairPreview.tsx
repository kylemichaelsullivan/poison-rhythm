import {
	BRAND_DOMINANT_HEX,
	BRAND_SECONDARY_HEX,
	type ColorRole,
	type CrayonId,
	crayonByIdOrNull,
} from '@/lib/colors';
import { ColorPairPlayPreview } from './ColorPairPlayPreview';
import { ColorRoleTile } from './ColorRoleTile';

type ColorPairPreviewProps = {
	dominantId: CrayonId | null;
	secondaryId: CrayonId | null;
	role: ColorRole;
	onRoleChange: (role: ColorRole) => void;
};

function roleHex(
	id: CrayonId | null,
	fallback: string,
): { hex: string; name: string } {
	const crayon = crayonByIdOrNull(id);
	return {
		hex: crayon?.hex ?? fallback,
		name:
			crayon?.name ??
			(fallback === BRAND_DOMINANT_HEX ? 'Poison Purple' : 'Poison Mint'),
	};
}

export function ColorPairPreview({
	dominantId,
	secondaryId,
	role,
	onRoleChange,
}: ColorPairPreviewProps) {
	const dominant = roleHex(dominantId, BRAND_DOMINANT_HEX);
	const secondary = roleHex(secondaryId, BRAND_SECONDARY_HEX);

	return (
		<div className='ColorPairPreview flex flex-col gap-3'>
			<fieldset className='grid grid-cols-2 gap-2 border-0 p-0'>
				<legend className='sr-only'>Color Role</legend>
				<ColorRoleTile
					label='Dominant'
					hex={dominant.hex}
					name={dominant.name}
					selected={role === 'dominant'}
					onSelect={() => onRoleChange('dominant')}
				/>
				<ColorRoleTile
					label='Secondary'
					hex={secondary.hex}
					name={secondary.name}
					selected={role === 'secondary'}
					onSelect={() => onRoleChange('secondary')}
				/>
			</fieldset>
			<ColorPairPlayPreview
				dominantHex={dominant.hex}
				secondaryHex={secondary.hex}
			/>
		</div>
	);
}
