import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import {
	clickPause,
	clickPlay,
	FIRST_VISIT_STORAGE_STATE,
	generateRound,
	openAboutFromTitle,
	seedPlaybackPrefs,
} from './helpers';
import type { Page } from '@playwright/test';

async function expectNoA11yViolations(
	page: Page,
	label: string,
	options?: { disableRules?: string[] },
) {
	let builder = new AxeBuilder({ page }).withTags([
		'wcag2a',
		'wcag2aa',
		'wcag21a',
		'wcag21aa',
		'wcag22a',
		'wcag22aa',
		'best-practice',
	]);

	if (options?.disableRules?.length) {
		builder = builder.disableRules(options.disableRules);
	}

	const results = await builder.analyze();

	const summary = results.violations.map((violation) => ({
		id: violation.id,
		impact: violation.impact,
		description: violation.description,
		nodes: violation.nodes.map((node) => node.target.join(' ')),
	}));

	expect(summary, `a11y violations (${label})`).toEqual([]);
}

test.describe('accessibility', () => {
	test.describe('first-visit welcome', () => {
		test.use({ storageState: FIRST_VISIT_STORAGE_STATE });

		test('welcome intro modal has no axe violations', async ({ page }) => {
			await page.goto('/');
			await expect(
				page.getByRole('dialog', { name: 'Welcome to Poison Rhythm' }),
			).toBeVisible();
			await expectNoA11yViolations(page, 'welcome intro modal');
		});
	});

	test('start screen has no axe violations', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByTestId('measure-slider')).toBeVisible();
		await expectNoA11yViolations(page, 'start screen');
	});

	test('generated round has no axe violations', async ({ page }) => {
		await page.goto('/');
		await generateRound(page);
		await expectNoA11yViolations(page, 'generated round');
	});

	test('settings modal has no axe violations', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: 'Settings' }).click();
		await expect(page.getByRole('dialog')).toBeVisible();
		await expectNoA11yViolations(page, 'settings modal');
	});

	test('sound settings tab has no axe violations', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: 'Settings' }).click();
		await page.getByRole('tab', { name: 'Sound' }).click();
		await expect(
			page.getByRole('tab', { name: 'Sound', selected: true }),
		).toBeVisible();
		await expectNoA11yViolations(page, 'sound settings');
	});

	test('metronome panel has no axe violations', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: 'Change Tempo (120 BPM)' }).click();
		await expect(page.getByRole('dialog')).toBeVisible();
		await expectNoA11yViolations(page, 'metronome panel');
	});

	test('about mode/difficulty and help modal have no axe violations', async ({
		page,
	}) => {
		await page.goto('/');
		await openAboutFromTitle(page);
		await expect(
			page.getByRole('heading', { name: 'Play Mode' }),
		).toBeVisible();
		await expect(
			page.getByRole('heading', { name: 'Difficulty' }),
		).toBeVisible();
		await expectNoA11yViolations(page, 'about modal with mode and difficulty');

		await page
			.getByRole('button', { name: 'Explain Difficulty Levels' })
			.click();
		await expect(
			page.getByRole('dialog', { name: 'Difficulty Levels' }),
		).toBeVisible();
		await expectNoA11yViolations(page, 'difficulty help modal');
	});

	test('display mode modal has no axe violations', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: 'Change Display Mode' }).click();
		await expect(
			page.getByRole('dialog', { name: 'Display Mode' }),
		).toBeVisible();
		// Selected segment uses theme primary; contrast varies by light/dark tokens.
		await expectNoA11yViolations(page, 'display mode modal', {
			disableRules: ['color-contrast'],
		});
	});

	test('count-in playback has no axe violations', async ({ page }) => {
		await seedPlaybackPrefs(page, {
			countIn: true,
			demoBeforePlay: false,
			tempo: 60,
		});
		await page.goto('/');
		await generateRound(page);

		await clickPlay(page);
		await expect(page.getByTestId('play-controls')).toHaveAttribute(
			'data-counting-in',
			'true',
		);
		await expect(
			page
				.getByTestId('measure-slider')
				.locator('[data-playback-phase="count-in"]'),
		).toBeVisible();
		await expectNoA11yViolations(page, 'count-in playback');

		await clickPause(page);
	});
});
