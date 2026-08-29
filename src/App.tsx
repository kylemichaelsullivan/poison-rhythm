import clsx from 'clsx';
import {
	AboutPoisonRhythmProvider,
	Body,
	Footer,
	Header,
} from '@/components/layout';
import { GameProvider } from '@/contexts';
import { pageSurfaceClassName } from '@/lib/control-classes';

function AppContent() {
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
}

function App() {
	return (
		<AboutPoisonRhythmProvider>
			<GameProvider>
				<AppContent />
			</GameProvider>
		</AboutPoisonRhythmProvider>
	);
}

export default App;
