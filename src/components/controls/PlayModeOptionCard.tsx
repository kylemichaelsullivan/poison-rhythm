import type { ReactNode } from 'react';
import type { GameMode } from '@/lib/settings-schema';
import { DescribedOptionCard } from './DescribedOptionCard';

type PlayModeOptionCardProps = {
	id: string;
	name: string;
	value: GameMode;
	label: string;
	description: string;
	selected: boolean;
	onSelect: (value: GameMode) => void;
	leading?: ReactNode;
	selectedFooter?: ReactNode;
};

export function PlayModeOptionCard(props: PlayModeOptionCardProps) {
	return <DescribedOptionCard {...props} />;
}
