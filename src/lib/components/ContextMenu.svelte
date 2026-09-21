<script lang="ts">
	import { tick } from 'svelte';

	type MenuItem = {
		label: string;
		action: () => void;
		danger?: boolean;
	};

	let {
		items = [],
		x = $bindable(0),
		y = $bindable(0),
		open = $bindable(false)
	}: {
		items?: MenuItem[];
		x?: number;
		y?: number;
		open?: boolean;
	} = $props();

	let menuEl = $state<HTMLDivElement | null>(null);

	function handleGlobal(e: MouseEvent) {
		if (open && menuEl && !menuEl.contains(e.target as Node)) {
			open = false;
		}
	}
	function handleKey(e: KeyboardEvent) {
		if (e.key === 'Escape') open = false;
	}
	function handleScrollOrResize() {
		open = false;
	}

	async function adjustPosition() {
		await tick();
		if (!menuEl) return;
		const rect = menuEl.getBoundingClientRect();
		if (x + rect.width > window.innerWidth) x = window.innerWidth - rect.width - 8;
		if (y + rect.height > window.innerHeight) y = window.innerHeight - rect.height - 8;
	}

	// Attach/detach global listeners whenever `open` changes
	$effect(() => {
		if (!open) return;

		window.addEventListener('mousedown', handleGlobal);
		window.addEventListener('keydown', handleKey);
		window.addEventListener('scroll', handleScrollOrResize, true);
		window.addEventListener('resize', handleScrollOrResize);

		// Re-check bounds every time the menu opens or position changes
		adjustPosition();

		return () => {
			window.removeEventListener('mousedown', handleGlobal);
			window.removeEventListener('keydown', handleKey);
			window.removeEventListener('scroll', handleScrollOrResize, true);
			window.removeEventListener('resize', handleScrollOrResize);
		};
	});
</script>

{#if open}
	<div
		bind:this={menuEl}
		class="fixed z-9999 flex min-w-45 flex-col rounded-lg border border-gray-200 bg-white p-1 shadow-xl"
		style="top: {y}px; left: {x}px;"
		role="menu"
	>
		{#each items as item (item.label)}
			<button
				class="rounded-md px-3 py-2 text-left text-sm transition-colors
               {item.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-900 hover:bg-gray-100'}"
				role="menuitem"
				onclick={() => {
					item.action();
					open = false;
				}}
			>
				{item.label}
			</button>
		{/each}
	</div>
{/if}
