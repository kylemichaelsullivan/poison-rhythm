import { useId } from 'react';
import { type ThemePreference, themeOptionFor } from '@/lib';
import { FieldCaption } from './FieldCaption';
import { SegmentedControl } from './SegmentedControl';
import { THEME_SEGMENTS } from './theme-segments';

type ThemeSettingProps = {
	value: ThemePreference;
	onChange: (theme: ThemePreference) => void;
};

export function ThemeSetting({ value, onChange }: ThemeSettingProps) {
	const captionId = useId();
	const selected = themeOptionFor(value);

	return (
		<div className='ThemeSetting flex flex-col gap-2'>
			<SegmentedControl
				options={THEME_SEGMENTS}
				value={value}
				onChange={onChange}
				ariaLabel='Theme'
				describedBy={captionId}
			/>
			<FieldCaption id={captionId}>{selected.caption}</FieldCaption>
		</div>
	);
}
