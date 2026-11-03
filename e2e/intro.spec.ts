import { expect, test } from '@playwright/test';
import { FIRST_VISIT_STORAGE_STATE, INTRO_SEEN_KEY } from './helpers';

const SIMON_SAYS = 'Simon says: “Play this”';

test.describe('first-visit welcome', () => {
	test.use({ storageState: FIRST_VISIT_STORAGE_STATE });

	test('walks Simon Says then poison, and stays when skip is unchecked', async ({
		page,
	}) => {
		await page.goto('/');
		const dialog = page.getByRole('dialog', {
			name: 'Welcome to Poison Rhythm',
		});
		await expect(dialog).toBeVisible();
		await expect(
			dialog.getByRole('heading', { name: 'Poison Rhythm', exact: true }),
		).toBeVisible();
		await expect(
			dialog.getByRole('heading', { name: 'Measure' }),
		).toBeVisible();
		await expect(dialog.getByText(SIMON_SAYS)).toBeVisible();
		await expect(dialog.getByText('That’s the Poison…')).toHaveCount(0);
		await expect(dialog.getByText('Play it, and you lose!')).toHaveCount(0);
		const skip = dialog.getByRole('button', { name: /Don’t show again/ });
		await expect(skip).toHaveAttribute('aria-pressed', 'true');
		await skip.click();
		await expect(skip).toHaveAttribute('aria-pressed', 'false');

		await dialog.getByRole('button', { name: 'Next' }).click();
		await expect(dialog.getByText(SIMON_SAYS)).toBeVisible();
		await expect(
			dialog.getByRole('heading', { name: 'Poison Rhythm', exact: true }),
		).toBeVisible();
		await expect(
			dialog.getByRole('heading', { name: 'Measure' }),
		).toBeVisible();

		await dialog.getByRole('button', { name: 'Next' }).click();
		await expect(dialog.getByText(SIMON_SAYS)).toHaveCount(0);
		await expect(
			dialog.getByText('“Play this”', { exact: true }),
		).toBeVisible();
		await expect(dialog.getByText('That’s the Poison…')).toBeVisible({
			timeout: 2000,
		});
		await expect(dialog.getByText('Play it, and you lose!')).toBeVisible({
			timeout: 2000,
		});
		await expect(
			dialog.getByRole('heading', { name: 'Poison Rhythm', exact: true }),
		).toBeVisible();
		await expect(
			dialog.getByRole('heading', { name: 'Measure' }),
		).toBeVisible();
		await expect(dialog.getByLabel('Step 3 of 3')).toBeVisible();
		await expect(dialog.getByText('Don’t show again')).toBeVisible();

		await dialog.getByRole('button', { name: 'Let’s Play' }).click();
		await expect(dialog).toBeHidden();
		await expect
			.poll(() =>
				page.evaluate((key) => localStorage.getItem(key), INTRO_SEEN_KEY),
			)
			.toBeNull();

		await page.reload();
		await expect(
			page.getByRole('dialog', { name: 'Welcome to Poison Rhythm' }),
		).toBeVisible();
		await expect(page.getByText(SIMON_SAYS)).toBeVisible();
	});

	test('checked skip by default remembers this device', async ({ page }) => {
		await page.goto('/');
		const dialog = page.getByRole('dialog', {
			name: 'Welcome to Poison Rhythm',
		});
		await expect(dialog).toBeVisible();
		await expect(
			dialog.getByRole('button', { name: /Don’t show again/ }),
		).toHaveAttribute('aria-pressed', 'true');
		await dialog.getByRole('button', { name: 'Next' }).click();
		await dialog.getByRole('button', { name: 'Next' }).click();
		await dialog.getByRole('button', { name: 'Let’s Play' }).click();
		await expect(dialog).toBeHidden();
		await expect
			.poll(() =>
				page.evaluate((key) => localStorage.getItem(key), INTRO_SEEN_KEY),
			)
			.toBe('true');

		await page.reload();
		await expect(
			page.getByRole('dialog', { name: 'Welcome to Poison Rhythm' }),
		).toHaveCount(0);
		await expect(page.getByTestId('measure-slider')).toBeVisible();
	});

	test('nav dots jump to that step', async ({ page }) => {
		await page.goto('/');
		const dialog = page.getByRole('dialog', {
			name: 'Welcome to Poison Rhythm',
		});
		await expect(dialog).toBeVisible();
		await expect(dialog.getByText(SIMON_SAYS)).toBeVisible();

		await dialog.getByRole('button', { name: 'Step 3 of 3' }).click();
		await expect(dialog.getByText(SIMON_SAYS)).toHaveCount(0);
		await expect(
			dialog.getByText('“Play this”', { exact: true }),
		).toBeVisible();
		await expect(dialog.getByText('That’s the Poison…')).toBeVisible({
			timeout: 2000,
		});
		await expect(dialog.getByText('Play it, and you lose!')).toBeVisible({
			timeout: 2000,
		});
		await expect(
			dialog.getByRole('button', { name: 'Let’s Play' }),
		).toBeVisible();

		await dialog.getByRole('button', { name: 'Step 1 of 3' }).click();
		await expect(dialog.getByText(SIMON_SAYS)).toBeVisible();
		await expect(dialog.getByRole('button', { name: 'Next' })).toBeVisible();
	});

	test('arrow keys move between steps', async ({ page }) => {
		await page.goto('/');
		const dialog = page.getByRole('dialog', {
			name: 'Welcome to Poison Rhythm',
		});
		await expect(dialog).toBeVisible();
		await expect(
			dialog.getByRole('button', { name: 'Step 1 of 3' }),
		).toHaveAttribute('aria-current', 'step');

		await page.keyboard.press('ArrowRight');
		await expect(
			dialog.getByRole('button', { name: 'Step 2 of 3' }),
		).toHaveAttribute('aria-current', 'step');
		await expect(dialog.getByText(SIMON_SAYS)).toBeVisible();

		await page.keyboard.press('ArrowRight');
		await expect(
			dialog.getByRole('button', { name: 'Step 3 of 3' }),
		).toHaveAttribute('aria-current', 'step');
		await expect(
			dialog.getByRole('button', { name: 'Let’s Play' }),
		).toBeVisible();

		await page.keyboard.press('ArrowLeft');
		await expect(
			dialog.getByRole('button', { name: 'Step 2 of 3' }),
		).toHaveAttribute('aria-current', 'step');
		await expect(dialog.getByRole('button', { name: 'Next' })).toBeVisible();
	});

	test('close button only remembers this device when skip is checked', async ({
		page,
	}) => {
		await page.goto('/');
		const dialog = page.getByRole('dialog', {
			name: 'Welcome to Poison Rhythm',
		});
		await expect(dialog).toBeVisible();
		await dialog.getByRole('button', { name: /Don’t show again/ }).click();
		await dialog.getByRole('button', { name: 'Close Modal' }).click();
		await expect(dialog).toBeHidden();
		await expect
			.poll(() =>
				page.evaluate((key) => localStorage.getItem(key), INTRO_SEEN_KEY),
			)
			.toBeNull();
	});
});

test.describe('returning visit', () => {
	test('does not open the welcome when this device already opted out', async ({
		page,
	}) => {
		await page.goto('/');
		await expect(page.getByTestId('measure-slider')).toBeVisible();
		await expect(
			page.getByRole('dialog', { name: 'Welcome to Poison Rhythm' }),
		).toHaveCount(0);
	});

	test('Settings can reopen the welcome tutorial', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: 'Settings' }).click();
		await page.getByRole('button', { name: 'Show Welcome' }).click();
		await expect(
			page.getByRole('dialog', { name: 'Welcome to Poison Rhythm' }),
		).toBeVisible();
		await expect(page.getByText(SIMON_SAYS)).toBeVisible();
	});
});
