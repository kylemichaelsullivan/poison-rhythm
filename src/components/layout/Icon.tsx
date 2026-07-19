import clsx from 'clsx';
import type { ComponentType, SVGProps } from 'react';

export type SvgIconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export type IconSize = 'sm' | 'md';

const iconBaseClassName = 'Icon block aspect-square fill-current';

const iconSizeClassNames: Record<IconSize, string> = {
	sm: 'w-5 h-5',
	md: 'w-6 h-6',
};

type IconProps = {
	svg: SvgIconComponent;
	size?: IconSize;
	/** Inline in a flex row (e.g. expanded corner button). Default: centered alone. */
	inline?: boolean;
};

export function Icon({ svg: Svg, size = 'sm', inline = false }: IconProps) {
	return (
		<Svg
			className={clsx(
				iconBaseClassName,
				iconSizeClassNames[size],
				inline && 'shrink-0',
			)}
		/>
	);
}
