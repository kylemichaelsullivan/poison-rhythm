import CheckmarkIcon from '@/assets/svg/checkmark.svg?react';
import { IconToggle } from '@/components/layout/settings';
import { Row } from '@/components/ui';

type IntroSkipToggleProps = {
	checked: boolean;
	onChange: (checked: boolean) => void;
};

/** Opt in to hiding the welcome on this device. */
export function IntroSkipToggle({ checked, onChange }: IntroSkipToggleProps) {
	const actionLabel = checked ? 'Disable' : 'Enable';

	return (
		<Row justify='center' gap='2' fullWidth>
			<IconToggle
				label={`Don’t show again: ${actionLabel}`}
				title={`Click to ${actionLabel}`}
				pressed={checked}
				pressedIcon={CheckmarkIcon}
				variant='checkbox'
				size='sm'
				onPressedChange={onChange}
			/>
			<span className='text-sm font-semibold text-dark' aria-hidden>
				Don’t show again
			</span>
		</Row>
	);
}
