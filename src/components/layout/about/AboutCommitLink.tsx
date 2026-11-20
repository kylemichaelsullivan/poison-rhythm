import { useEffect, useRef, useState } from 'react';
import GithubIcon from '@/assets/svg/github.svg?react';
import type { MouseEvent } from 'react';

const COMMIT_DISPLAY_LENGTH = 7;
/** Sustained hover before the commit SHA becomes a link (casual clicks stay inert). */
const COMMIT_LINK_HOVER_MS = 1000;

type AboutCommitLinkProps = {
	commitSha: string;
	commitUrl: string;
};

/**
 * Quiet build-commit chip for the About brand: GitHub mark + short SHA.
 * Layout-neutral translate tucks it toward the title; a 1000ms hover arms the link.
 */
export function AboutCommitLink({
	commitSha,
	commitUrl,
}: AboutCommitLinkProps) {
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

	const chipClassName = linkArmed
		? 'AboutCommitLink inline-flex -translate-y-2 items-center gap-1 text-xs text-muted tabular-nums underline underline-offset-2 opacity-100'
		: 'AboutCommitLink inline-flex -translate-y-2 items-center gap-1 text-xs text-muted tabular-nums no-underline opacity-55';

	const content = (
		<>
			<GithubIcon aria-hidden className='size-3 fill-current' />
			<span>{commitLabel}</span>
		</>
	);

	if (!canLink) {
		return <span className={chipClassName}>{content}</span>;
	}

	return (
		<a
			href={linkArmed ? commitUrl : undefined}
			target={linkArmed ? '_blank' : undefined}
			rel={linkArmed ? 'noopener noreferrer' : undefined}
			title={`View commit ${commitLabel} on GitHub`}
			tabIndex={linkArmed ? 0 : -1}
			aria-disabled={linkArmed ? undefined : true}
			aria-label={
				linkArmed
					? `View commit ${commitLabel} on GitHub`
					: `Commit ${commitLabel}`
			}
			className={chipClassName}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onClick={handleClick}
		>
			{content}
		</a>
	);
}
