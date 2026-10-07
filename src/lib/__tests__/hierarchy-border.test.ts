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
		expect(hierarchyRankForContrastGrade('AAA', true)).toBe('active');
		expect(hierarchyRankForContrastGrade('AA', false)).toBe('emphasis');
		expect(hierarchyRankForContrastGrade('UI', false)).toBe('structure');
		expect(hierarchyRankForContrastGrade('Fail', false)).toBe('provisional');
	});
});
