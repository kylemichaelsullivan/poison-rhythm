import { useGame } from '@/contexts';
import { PoisonHitOverlay } from './PoisonHitOverlay';

/** App-level host for the Classic full-screen poison-hit animation. */
export function PoisonHitOverlayHost() {
	const { poisonHitOpen, acknowledgePoisonHit } = useGame();

	return (
		<PoisonHitOverlay open={poisonHitOpen} onClose={acknowledgePoisonHit} />
	);
}
