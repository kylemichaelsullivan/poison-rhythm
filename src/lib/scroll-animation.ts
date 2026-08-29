import type { ScrollDirection, ScrollSpeed } from '@/lib/settings-schema';

const SPEED_MS: Record<ScrollSpeed, number> = {
	slow: 800,
	medium: 500,
	fast: 300,
};

export function scrollAnimationClass(
	direction: ScrollDirection,
	speed: ScrollSpeed,
): string {
	if (direction === 'none') return '';
	return `scroll-${direction} scroll-${speed}`;
}

export function scrollTransitionDuration(speed: ScrollSpeed): number {
	return SPEED_MS[speed];
}

export function scrollTransform(direction: ScrollDirection): string {
	switch (direction) {
		case 'left':
			return 'translateX(-100%)';
		case 'right':
			return 'translateX(100%)';
		case 'up':
			return 'translateY(-100%)';
		case 'down':
			return 'translateY(100%)';
		default:
			return 'none';
	}
}
