export type MeasureCompleteAction = 'advance' | 'stop';

export function shouldProcessMeasureCycle(
	isPlaying: boolean,
	measureCycle: number,
	lastProcessedCycle: number,
): boolean {
	return isPlaying && measureCycle > 0 && measureCycle !== lastProcessedCycle;
}

export function measureCompleteAction(options: {
	currentIndex: number;
	measuresLength: number;
	isPoisonMeasure: boolean;
	shouldStopGame: boolean;
}): MeasureCompleteAction {
	if (options.isPoisonMeasure || options.shouldStopGame) return 'stop';
	if (options.currentIndex >= options.measuresLength - 1) return 'stop';
	return 'advance';
}
