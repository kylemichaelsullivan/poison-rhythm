import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { inputSurfaceClassName } from '@/lib/control-classes';
import { PROFILE_NAME_LABEL } from '@/lib/ui-copy';

type ProfileNameFieldProps = {
	id: string;
	value: string;
	onChange: (value: string) => void;
	onSubmit?: () => void;
	placeholder?: string;
	/** Focus and select when mounted (rename flow). */
	focusOnMount?: boolean;
};

export function ProfileNameField({
	id,
	value,
	onChange,
	onSubmit,
	placeholder = 'Name',
	focusOnMount = false,
}: ProfileNameFieldProps) {
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (!focusOnMount) {
			return;
		}
		const input = inputRef.current;
		if (!input) {
			return;
		}
		input.focus();
		input.select();
	}, [focusOnMount]);

	return (
		<input
			ref={inputRef}
			id={id}
			type='text'
			className={clsx(
				inputSurfaceClassName,
				'w-full min-w-0 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white',
			)}
			value={value}
			placeholder={placeholder}
			maxLength={40}
			aria-label={PROFILE_NAME_LABEL}
			data-modal-initial-focus={focusOnMount ? 'true' : undefined}
			onChange={(event) => onChange(event.target.value)}
			onKeyDown={(event) => {
				if (event.key === 'Enter') {
					event.preventDefault();
					onSubmit?.();
				}
			}}
		/>
	);
}
