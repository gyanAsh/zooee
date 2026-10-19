<script lang="ts">
	import { Button } from 'bits-ui';

	const { children, isActive = false, variant = 'primary', onClick = () => {} } = $props();
</script>

<Button.Root
	onclick={() => onClick()}
	class="cursor-pointer rounded-lg px-2 py-1.5 text-sm transition-colors
		{variant === 'primary'
		? 'btn'
		: variant === 'secondary'
			? 'secondary_btn'
			: variant === 'black'
				? ''
				: variant === 'ghost'
					? isActive
						? 'btn'
						: 'ghost_btn'
					: ''}"
	aria-current={isActive ? 'page' : undefined}
>
	{@render children()}
</Button.Root>

<style>
	:global(.btn) {
		background: linear-gradient(#2b7fff, #50a1ff);

		color: white;
		box-shadow:
			inset 0 1px 0 #ffffff56,
			inset 0 -2px 0 #0003,
			0 1px 2px #0006,
			0 8px 24px -6px #8ec5ff99;
	}
	:global(.btn:active) {
		translate: 0 1px;
		box-shadow: inset 0 2px 4px #0004;
	}

	:global(.black_btn) {
		background: linear-gradient(#18181b, #27272a);

		color: white;
		box-shadow:
			inset 0 1px 0 #ffffff56,
			inset 0 -2px 0 #0003,
			0 1px 2px #0006,
			0 8px 24px -6px #d4d4d899;
	}
	:global(.black_btn:active) {
		translate: 0 1px;
		box-shadow: inset 0 2px 4px #0004;
	}

	:global(.secondary_btn) {
		background: linear-gradient(#d1d5dc, #e5e7eb);
		color: #111828;
		box-shadow:
			inset 0 1px 0 #ffffff56,
			inset 0 -2px 0 #0003,
			0 1px 2px #0006,
			0 8px 24px -6px #d1d5dc99;
	}
	:global(.secondary_btn:active) {
		translate: 0 1px;
		box-shadow: inset 0 2px 4px #0004;
	}
	:global(.ghost_btn) {
		background: transparent;

		color: #4a5565;
	}
	:global(.ghost_btn:hover) {
		background: #e5e7eb;

		color: #111828;
	}
	:global(.ghost_btn:active) {
		translate: 0 1px;
		box-shadow: inset 0 2px 4px #0004;
	}
</style>
