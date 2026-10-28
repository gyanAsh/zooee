import { page, userEvent } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Select from './select.svelte';

const items = [
	{ value: 'apple', label: 'Apple' },
	{ value: 'banana', label: 'Banana' },
	{ value: 'cherry', label: 'Cherry' }
];

describe('select.svelte', () => {
	it('filters items by label and selects the highlighted result', async () => {
		render(Select, { items, placeholder: 'Pick a fruit' });

		await page.getByRole('button', { name: 'Pick a fruit' }).click();

		const search = page.getByPlaceholder('Search...');
		await expect.element(search).toBeInTheDocument();
		await expect.element(search).toHaveFocus();

		await search.fill('ban');

		await expect.element(page.getByRole('option', { name: 'Banana' })).toBeInTheDocument();
		await expect.element(page.getByRole('option', { name: 'Apple' })).not.toBeInTheDocument();
		await expect.element(page.getByRole('option', { name: 'Cherry' })).not.toBeInTheDocument();

		await userEvent.keyboard('{Enter}');

		await expect
			.element(page.getByRole('button', { name: 'Pick a fruit' }))
			.toHaveTextContent('Banana');
	});

	it('supports arrow-key navigation inside the filtered results', async () => {
		render(Select, {
			items: [...items, { value: 'mango', label: 'Mango' }],
			placeholder: 'Pick a fruit'
		});

		await page.getByRole('button', { name: 'Pick a fruit' }).click();
		await page.getByPlaceholder('Search...').fill('an');

		await expect
			.element(page.getByRole('option', { name: 'Banana' }))
			.toHaveAttribute('data-highlighted');

		await userEvent.keyboard('{ArrowDown}');

		await expect
			.element(page.getByRole('option', { name: 'Mango' }))
			.toHaveAttribute('data-highlighted');

		await userEvent.keyboard('{Enter}');

		await expect
			.element(page.getByRole('button', { name: 'Pick a fruit' }))
			.toHaveTextContent('Mango');
	});

	it('shows an empty state when nothing matches', async () => {
		render(Select, { items, placeholder: 'Pick a fruit' });

		await page.getByRole('button', { name: 'Pick a fruit' }).click();
		await page.getByPlaceholder('Search...').fill('zzz');

		await expect.element(page.getByText('No results found')).toBeInTheDocument();
		await expect.element(page.getByRole('option')).not.toBeInTheDocument();
	});
});
