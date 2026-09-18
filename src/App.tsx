import clsx from 'clsx';
import { memo } from 'react';
import {
	AboutPoisonRhythmProvider,
	Body,
	Footer,
	Header,
} from '@/components/layout';
import { GameProvider, PendingDifficultyProvider } from '@/contexts';
import { pageSurfaceClassName } from '@/lib/control-classes';

const AppContent = memo(function AppContent() {
	return (
		<div
			className={clsx(
				'flex min-h-dvh flex-col items-center gap-6 overflow-x-clip',
				pageSurfaceClassName,
			)}
		>
			<Header />
			<Body />
			<Footer />
		</div>
	);
});

function App() {
	return (
		<GameProvider>
			<PendingDifficultyProvider>
				<AboutPoisonRhythmProvider>
					<AppContent />
				</AboutPoisonRhythmProvider>
			</PendingDifficultyProvider>
		</GameProvider>
	);
}

export default App;
