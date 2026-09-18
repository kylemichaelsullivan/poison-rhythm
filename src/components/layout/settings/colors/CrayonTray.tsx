import {
	assessCrayonContrast,
	type ColorRole,
	CRAYOLA_TRAYS,
	type CrayonId,
} from '@/lib/colors';
import { CrayonSwatch } from './CrayonSwatch';

type CrayonTrayProps = {
	role: ColorRole;
	selectedId: CrayonId | null;
	onSelect: (id: CrayonId) => void;
};

export function CrayonTray({ role, selectedId, onSelect }: CrayonTrayProps) {
	return (
		<fieldset className='CrayonTray flex min-w-0 flex-col gap-3 border-0 p-0'>
			<legend className='sr-only'>Crayon Colors</legend>
			{/*
			 * Physical Crayola box is landscape with four sleeves side-by-side.
			 * Portrait UI stacks the four sleeves; each sleeve keeps the
			 * familiar 2×8 face (16 squares).
			 */}
			{CRAYOLA_TRAYS.map((tray) => (
				<section
					key={tray.id}
					className='CrayonTraySleeve flex flex-col gap-1.5 rounded-lg border border-mid bg-surface-muted p-2 shadow-soft'
					aria-label={tray.label}
				>
					<h4 className='text-xs font-semibold uppercase tracking-wide text-muted'>
						{tray.label}
					</h4>
					<div className='grid grid-cols-8 gap-1 max-[380px]:grid-cols-4'>
						{tray.crayons.map((crayon) => {
							const assessment = assessCrayonContrast(crayon.hex, role);
							const selected = selectedId === crayon.id;
							return (
								<CrayonSwatch
									key={crayon.id}
									name={crayon.name}
									hex={crayon.hex}
									selected={selected}
									warning={assessment.level}
									onSelect={() => onSelect(crayon.id)}
								/>
							);
						})}
					</div>
				</section>
			))}
		</fieldset>
	);
}
