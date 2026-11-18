import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';

const COMMIT_DISPLAY_LENGTH = 7;
/** Sustained hover before the commit SHA becomes a link (casual clicks stay inert). */
const COMMIT_LINK_HOVER_MS = 500;

type AboutBrandHeaderProps = {
	commitSha: string;
	commitUrl: string;
};

/** Brand block for the About modal: icon, title and hover-armed commit link. */
export function AboutBrandHeader({
	commitSha,
	commitUrl,
}: AboutBrandHeaderProps) {
	const shortSha = commitSha.slice(0, COMMIT_DISPLAY_LENGTH);
	const commitLabel = shortSha || 'unknown';
	const canLink = Boolean(commitUrl && shortSha);
	const [linkArmed, setLinkArmed] = useState(false);
	const armTimerRef = useRef<number | undefined>(undefined);

	useEffect(() => {
		return () => {
			if (armTimerRef.current !== undefined) {
				window.clearTimeout(armTimerRef.current);
			}
		};
	}, []);

	function clearArmTimer() {
		if (armTimerRef.current !== undefined) {
			window.clearTimeout(armTimerRef.current);
			armTimerRef.current = undefined;
		}
	}

	function handleMouseEnter() {
		if (!canLink || linkArmed) return;
		clearArmTimer();
		armTimerRef.current = window.setTimeout(() => {
			armTimerRef.current = undefined;
			setLinkArmed(true);
		}, COMMIT_LINK_HOVER_MS);
	}

	function handleMouseLeave() {
		clearArmTimer();
		setLinkArmed(false);
	}

	function handleClick(event: MouseEvent<HTMLAnchorElement>) {
		if (!linkArmed) {
			event.preventDefault();
		}
	}

	return (
		<div className='AboutBrandHeader flex flex-col items-center gap-3 pt-1'>
			<img
				src='/apple-touch-icon.png'
				alt=''
				width={72}
				height={72}
				draggable={false}
				className='size-18 rounded-xl'
			/>
			<h2 className='AppTitleBrand text-2xl font-bold tracking-tight'>
				Poison Rhythm
			</h2>
			{canLink ? (
				<a
					href={linkArmed ? commitUrl : undefined}
					target={linkArmed ? '_blank' : undefined}
					rel={linkArmed ? 'noopener noreferrer' : undefined}
					title={commitSha}
					tabIndex={linkArmed ? 0 : -1}
					aria-disabled={linkArmed ? undefined : true}
					aria-label={
						linkArmed
							? `View commit ${commitLabel} on GitHub`
							: `Commit ${commitLabel}`
					}
					className={
						linkArmed
							? 'text-sm text-muted tabular-nums underline underline-offset-2'
							: 'text-sm text-muted tabular-nums no-underline'
					}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
					onClick={handleClick}
				>
					{commitLabel}
				</a>
			) : (
				<p className='text-sm text-muted tabular-nums'>{commitLabel}</p>
			)}
		</div>
	);
}
