import { describe, expect, test } from 'bun:test';
import {
	hierarchyBorderClass,
	hierarchyBorderWeightClass,
	hierarchyRankForContrastGrade,
} from '../hierarchy-border';

describe('hierarchy-border', () => {
	test('provisional is dashed border-2; active is solid border-2', () => {
		expect(hierarchyBorderWeightClass('provisional')).toContain(
			'border-dashed',
		);
		expect(hierarchyBorderWeightClass('provisional')).toContain('border-2');
		expect(hierarchyBorderWeightClass('active')).toContain('border-solid');
		expect(hierarchyBorderWeightClass('active')).toContain('border-2');
		expect(hierarchyBorderWeightClass('structure')).toBe('border border-solid');
	});

	test('tone is applied with rank', () => {
		expect(hierarchyBorderClass('active', 'secondary')).toContain(
			'border-secondary',
		);
		expect(hierarchyBorderClass('provisional', 'primary')).toContain(
			'border-primary',
		);
	});

	test('contrast grades map to encouraging ranks', () => {
		expect(hierarchyRankForContrastGrade('A', true)).toBe('active');
		expect(hierarchyRankForContrastGrade('B', false)).toBe('emphasis');
		expect(hierarchyRankForContrastGrade('C', false)).toBe('structure');
		expect(hierarchyRankForContrastGrade('F', false)).toBe('provisional');
	});
});
