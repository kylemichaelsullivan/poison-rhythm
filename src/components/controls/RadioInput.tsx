type RadioInputProps = {
	id: string;
	name: string;
	checked: boolean;
	onChange: () => void;
};

export function RadioInput({ id, name, checked, onChange }: RadioInputProps) {
	return (
		<input
			id={id}
			type='radio'
			name={name}
			className='sr-only'
			checked={checked}
			onChange={onChange}
		/>
	);
}
