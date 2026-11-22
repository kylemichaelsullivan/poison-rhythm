import { expect, test } from '@playwright/test';
import { TIMED_NOTICE_DURATION_MS } from '../src/lib/timed-notice';
import { generateRound, openAboutFromTitle } from './helpers';
import type { Page } from '@playwright/test';

async function draftDifficulty(page: Page) {
	await openAboutFromTitle(page);
	const about = page.getByRole('dialog', { name: 'About Poison Rhythm' });
	const slider = about.getByRole('slider', { name: 'Difficulty' });
	const current = Number(await slider.getAttribute('aria-valuenow'));
	await slider.focus();
	await page.keyboard.press(current >= 5 ? 'ArrowLeft' : 'ArrowRight');
	await about.getByRole('button', { name: 'Close Modal' }).click();
	await expect(about).toBeHidden();
}

test.describe('difficulty regen acknowledgement', () => {
	test('closes on its own with a theme progress bar and no OK button', async ({
		page,
	}) => {
		await page.goto('/');
		await generateRound(page);
		await draftDifficulty(page);

		const dialog = page.getByRole('dialog', { name: 'Difficulty Updated' });
		await expect(dialog).toBeVisible();
		await expect(dialog.getByRole('button', { name: 'OK' })).toHaveCount(0);
		await expect(
			dialog.getByText('A new pattern was generated.'),
		).toBeVisible();

		const progress = dialog.getByRole('progressbar', {
			name: 'Closing automatically',
		});
		await expect(progress).toHaveAttribute(
			'data-duration-ms',
			String(TIMED_NOTICE_DURATION_MS),
		);
		const box = await progress.boundingBox();
		expect(box?.height).toBeCloseTo(8, 0);

		const paint = await progress.evaluate((element) => {
			const style = getComputedStyle(element);
			return {
				backgroundColor: style.backgroundColor,
				backgroundImage: style.backgroundImage,
				animationName: style.animationName,
				animationDuration: style.animationDuration,
				transform: style.transform,
				reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)')
					.matches,
			};
		});
		expect(paint.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
		expect(paint.backgroundImage).toMatch(/linear-gradient\(to right,/);
		expect(paint.animationDuration).toBe(`${TIMED_NOTICE_DURATION_MS / 1000}s`);

		if (paint.reducedMotion) {
			expect(paint.animationName).toBe('none');
		} else {
			expect(paint.animationName).toContain('timed-notice-fill');
			await page.waitForTimeout(TIMED_NOTICE_DURATION_MS * 0.35);
			const mid = await progress.evaluate((element) => {
				const transform = getComputedStyle(element).transform;
				const match = /matrix\(([^,]+)/.exec(transform);
				return match ? Number(match[1]) : 1;
			});
			expect(mid).toBeGreaterThan(0.2);
			expect(mid).toBeLessThan(0.7);
		}

		await expect(dialog).toBeHidden({
			timeout: TIMED_NOTICE_DURATION_MS + 1500,
		});
	});

	test('the close control dismisses the notice immediately', async ({
		page,
	}) => {
		await page.goto('/');
		await generateRound(page);
		await draftDifficulty(page);

		const dialog = page.getByRole('dialog', { name: 'Difficulty Updated' });
		await expect(dialog).toBeVisible();
		await dialog.getByRole('button', { name: 'Close Modal' }).click();
		await expect(dialog).toBeHidden();
		await page.waitForTimeout(400);
		await expect(dialog).toHaveCount(0);
	});

	test('leaving difficulty unchanged does not open the notice', async ({
		page,
	}) => {
		await page.goto('/');
		await generateRound(page);
		await openAboutFromTitle(page);
		const about = page.getByRole('dialog', { name: 'About Poison Rhythm' });
		await about.getByRole('button', { name: 'Close Modal' }).click();
		await expect(
			page.getByRole('dialog', { name: 'Difficulty Updated' }),
		).toHaveCount(0);
	});

	test('hovering the notice pauses the timer until the pointer leaves', async ({
		page,
	}) => {
		await page.goto('/');
		await generateRound(page);
		await draftDifficulty(page);

		const dialog = page.getByRole('dialog', { name: 'Difficulty Updated' });
		await expect(dialog).toBeVisible();
		const progress = dialog.getByRole('progressbar', {
			name: 'Closing automatically',
		});
		await dialog.hover();
		await expect(progress).toHaveAttribute('data-paused', 'true');

		const scale = async () =>
			progress.evaluate((element) => {
				const transform = getComputedStyle(element).transform;
				const match = /matrix\(([^,]+)/.exec(transform);
				return match ? Number(match[1]) : 1;
			});
		const whileHovered = await scale();
		await page.waitForTimeout(TIMED_NOTICE_DURATION_MS);
		await expect(dialog).toBeVisible();
		expect(Math.abs((await scale()) - whileHovered)).toBeLessThan(0.08);

		await page.mouse.move(0, 0);
		await expect(progress).toHaveAttribute('data-paused', 'false');
		await expect(dialog).toBeHidden({
			timeout: TIMED_NOTICE_DURATION_MS + 1500,
		});
	});
});

test.describe('account profiles', () => {
	test('opens a persistent Account modal with the default profile', async ({
		page,
	}) => {
		await page.goto('/');
		await generateRound(page);
		await page
			.getByRole('banner')
			.getByRole('button', { name: 'Account' })
			.click();

		const dialog = page.getByRole('dialog', { name: 'Account' });
		await expect(dialog).toBeVisible();
		await expect(dialog.getByRole('progressbar')).toHaveCount(0);
		await expect(dialog.getByText('Default', { exact: true })).toBeVisible();
		await expect(dialog.getByText('Tempo Limits')).toBeVisible();
		await expect(
			dialog.getByRole('button', { name: 'Drag to Reorder: Default' }),
		).toBeVisible();
		await expect(
			dialog.getByRole('button', { name: 'Close Modal' }),
		).toBeVisible();
	});

	test('creates a profile and switches to it', async ({ page }) => {
		await page.goto('/');
		await generateRound(page);
		await page
			.getByRole('banner')
			.getByRole('button', { name: 'Account' })
			.click();

		const dialog = page.getByRole('dialog', { name: 'Account' });
		await dialog.getByLabel('Profile Name').fill('Alex');
		await dialog.getByRole('button', { name: 'Add' }).click();

		await expect(
			page.getByRole('banner').getByRole('button', { name: 'Account' }),
		).toHaveAttribute('title', 'Account: Alex');
		await expect(page.getByText('Created Profile: Alex')).toBeVisible();
	});

	test('reorders profiles with Move Up / Move Down', async ({ page }) => {
		await page.goto('/');
		await generateRound(page);
		await page
			.getByRole('banner')
			.getByRole('button', { name: 'Account' })
			.click();

		const dialog = page.getByRole('dialog', { name: 'Account' });
		await dialog.getByLabel('Profile Name').fill('Alex');
		await dialog.getByRole('button', { name: 'Add' }).click();

		await page
			.getByRole('banner')
			.getByRole('button', { name: 'Account' })
			.click();
		const account = page.getByRole('dialog', { name: 'Account' });
		await expect(account.getByText('Alex')).toBeVisible();

		await account.getByRole('button', { name: 'Move Alex Up' }).click();
		const names = account.locator('[data-profile-name]');
		await expect(names.nth(0)).toHaveAttribute('data-profile-name', 'Alex');
		await expect(names.nth(1)).toHaveAttribute('data-profile-name', 'Default');
		await expect(account.locator('output')).toContainText(
			'Alex moved to position 1 of 2.',
		);
	});
});
