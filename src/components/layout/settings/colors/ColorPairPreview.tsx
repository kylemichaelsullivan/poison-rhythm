import { type ColorRole, resolveAccentDisplay } from '@/lib/colors';
import type { ColorPreference } from '@/lib/preference-schemas';
import { ColorPairPlayPreview } from './ColorPairPlayPreview';
import { ColorRoleTile } from './ColorRoleTile';
import { SwapColorRolesButton } from './SwapColorRolesButton';

type ColorPairPreviewProps = {
	role: ColorRole;
	onRoleChange: (role: ColorRole) => void;
	dominantColor: ColorPreference;
	secondaryColor: ColorPreference;
	onSwap: () => void;
};

/** Role tiles + play preview; palette via props from the Colors composer. */
export function ColorPairPreview({
	role,
	onRoleChange,
	dominantColor,
	secondaryColor,
	onSwap,
}: ColorPairPreviewProps) {
	const dominant = resolveAccentDisplay(dominantColor, 'dominant');
	const secondary = resolveAccentDisplay(secondaryColor, 'secondary');

	return (
		<div className='ColorPairPreview flex flex-col gap-3'>
			<fieldset className='grid min-w-0 grid-cols-1 items-stretch justify-items-stretch gap-1.5 border-0 p-0 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center sm:gap-2'>
				<legend className='sr-only'>Color Role</legend>
				<ColorRoleTile
					label='Dominant'
					hex={dominant.hex}
					name={dominant.name}
					selected={role === 'dominant'}
					onSelect={() => onRoleChange('dominant')}
				/>
				<div className='flex justify-center'>
					<SwapColorRolesButton onSwap={onSwap} />
				</div>
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
