import { useMetronome } from '@/contexts/MetronomeContext';

export function useMetronomeBeat() {
	const { isLit, subdivisionIndex } = useMetronome();

	return { isLit, subdivisionIndex };
}
