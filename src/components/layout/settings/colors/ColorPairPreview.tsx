import clsx from 'clsx';
import {
	BRAND_DOMINANT_HEX,
	BRAND_SECONDARY_HEX,
	type ColorRole,
	type CrayonId,
	crayonByIdOrNull,
	pickOnColor,
} from '@/lib/colors';
import { focusVisibleRingClassName } from '@/lib/control-classes';

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

type RoleTileProps = {
	label: string;
	hex: string;
	name: string;
	selected: boolean;
	onSelect: () => void;
};

function RoleTile({ label, hex, name, selected, onSelect }: RoleTileProps) {
	const onColor = pickOnColor(hex);

	return (
		<button
			type='button'
			className={clsx(
				'flex min-h-16 flex-col items-start justify-between gap-2 rounded-lg border-2 px-3 py-2 text-left transition-[box-shadow,border-color]',
				focusVisibleRingClassName,
				selected
					? 'border-black shadow-raised z-10'
					: 'border-mid shadow-soft hover:border-primary',
			)}
			style={{ backgroundColor: hex, color: onColor }}
			aria-pressed={selected}
			aria-label={`${label}: ${name}`}
			title={`${label}: ${name}`}
			onClick={onSelect}
		>
			<span className='text-xs font-semibold uppercase tracking-wide opacity-90'>
				{label}
			</span>
			<span className='text-sm font-medium leading-tight'>{name}</span>
		</button>
	);
}

export function ColorPairPreview({
	dominantId,
	secondaryId,
	role,
	onRoleChange,
}: ColorPairPreviewProps) {
	const dominant = roleHex(dominantId, BRAND_DOMINANT_HEX);
	const secondary = roleHex(secondaryId, BRAND_SECONDARY_HEX);
	const onPrimary = pickOnColor(dominant.hex);

	return (
		<div className='ColorPairPreview flex flex-col gap-3'>
			<fieldset className='grid grid-cols-2 gap-2 border-0 p-0'>
				<legend className='sr-only'>Color Role</legend>
				<RoleTile
					label='Dominant'
					hex={dominant.hex}
					name={dominant.name}
					selected={role === 'dominant'}
					onSelect={() => onRoleChange('dominant')}
				/>
				<RoleTile
					label='Secondary'
					hex={secondary.hex}
					name={secondary.name}
					selected={role === 'secondary'}
					onSelect={() => onRoleChange('secondary')}
				/>
			</fieldset>
			<div
				className='flex items-center justify-between gap-3 rounded-lg border-2 px-3 py-2.5 shadow-soft'
				style={{
					backgroundColor: dominant.hex,
					borderColor: secondary.hex,
					color: onPrimary,
				}}
				aria-hidden='true'
			>
				<span className='text-sm font-semibold'>Play Preview</span>
				<span
					className='rounded border px-2 py-0.5 text-xs font-medium'
					style={{ borderColor: secondary.hex, color: onPrimary }}
				>
					Secondary Border
				</span>
			</div>
		</div>
	);
}
