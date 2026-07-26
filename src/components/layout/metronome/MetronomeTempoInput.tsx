import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { inputSurfaceClassName } from '@/lib/control-classes';
import { BPM_MAX, BPM_MIN } from '@/lib/metronome-defaults';
import { clampTempo } from '@/lib/metronome-tempo';

type MetronomeTempoInputProps = {
	tempo: number;
	onTempoChange: (value: number) => void;
};

export function MetronomeTempoInput({
	tempo,
	onTempoChange,
}: MetronomeTempoInputProps) {
	const [inputValue, setInputValue] = useState(String(tempo));
	const isEditingRef = useRef(false);

	useEffect(() => {
		if (!isEditingRef.current) {
			setInputValue(String(tempo));
		}
	}, [tempo]);

	function commitInput() {
		isEditingRef.current = false;

		if (inputValue === '') {
			setInputValue(String(tempo));
			return;
		}

		const parsed = Number(inputValue);

		if (!Number.isFinite(parsed)) {
			setInputValue(String(tempo));
			return;
		}

		onTempoChange(parsed);
	}

	function getCurrentTempo() {
		if (inputValue === '') {
			return tempo;
		}

		const parsed = Number(inputValue);

		if (!Number.isFinite(parsed)) {
			return tempo;
		}

		return parsed;
	}

	function adjustTempo(delta: number) {
		const next = clampTempo(getCurrentTempo() + delta);
		setInputValue(String(next));
		onTempoChange(next);
	}

	return (
		<input
			type='text'
			className={clsx(
				inputSurfaceClassName,
				'MetronomeTempoInput tabular-nums text-center w-16 p-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white',
			)}
			inputMode='numeric'
			pattern='[0-9]*'
			min={BPM_MIN}
			max={BPM_MAX}
			title='Set Tempo'
			aria-label='Beats per minute'
			value={inputValue}
			onFocus={(e) => {
				isEditingRef.current = true;
				e.target.select();
			}}
			onChange={(e) => {
				setInputValue(e.target.value.replace(/\D/g, ''));
			}}
			onBlur={commitInput}
			onKeyDown={(e) => {
				if (e.key === 'ArrowUp') {
					e.preventDefault();
					adjustTempo(1);
					return;
				}

				if (e.key === 'ArrowDown') {
					e.preventDefault();
					adjustTempo(-1);
					return;
				}

				if (e.key === 'Enter') {
					commitInput();
					e.currentTarget.blur();
					return;
				}

				if (e.key === 'Escape') {
					isEditingRef.current = false;
					setInputValue(String(tempo));
					e.currentTarget.blur();
				}
			}}
		/>
	);
}
