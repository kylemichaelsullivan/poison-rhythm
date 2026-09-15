/**
 * Regenerate documentation/printables/student-record.pdf from the HTML source.
 *
 * Usage: bun run scripts/generate-student-record-pdf.ts
 */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';

const root = path.resolve(import.meta.dir, '..');
const htmlPath = path.join(
	root,
	'documentation/printables/student-record.html',
);
const pdfPath = path.join(root, 'documentation/printables/student-record.pdf');

await mkdir(path.dirname(pdfPath), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
await page.pdf({
	path: pdfPath,
	format: 'Letter',
	printBackground: true,
	margin: {
		top: '0.55in',
		right: '0.55in',
		bottom: '0.55in',
		left: '0.55in',
	},
});
await browser.close();

console.log(`Wrote ${path.relative(root, pdfPath)}`);
