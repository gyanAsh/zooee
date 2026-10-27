<script lang="ts">
	import { ScrollArea } from 'bits-ui';
	import type { Snippet } from 'svelte';
	type CSSLength =
		| `${number}px`
		| `${number}rem`
		| `${number}em`
		| `${number}vh`
		| `${number}vw`
		| `${number}%`
		| 'fit-content';

	type PropTypes = { maxHeight: CSSLength; width?: CSSLength; children: Snippet };

	let { maxHeight, width = 'fit-content', children }: PropTypes = $props();
</script>

<ScrollArea.Root class="relative overflow-hidden">
	<ScrollArea.Viewport class="h-full" style="max-height: {maxHeight}; width: {width}">
		{@render children()}
	</ScrollArea.Viewport>
	<ScrollArea.Scrollbar
		orientation="vertical"
		class="data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out-0 data-[state=visible]:fade-in-0 flex w-2.5 touch-none rounded-full border-l border-l-transparent bg-muted p-px transition-all duration-200 select-none hover:w-3 hover:bg-dark-10"
	>
		<ScrollArea.Thumb class="flex-1 rounded-full bg-muted-foreground" />
	</ScrollArea.Scrollbar>
	<ScrollArea.Scrollbar
		orientation="horizontal"
		class="flex h-2.5 touch-none rounded-full border-t border-t-transparent bg-muted p-px transition-all duration-200 select-none hover:h-3 hover:bg-dark-10 "
	>
		<ScrollArea.Thumb class="rounded-full bg-muted-foreground" />
	</ScrollArea.Scrollbar>
	<ScrollArea.Corner />
</ScrollArea.Root>
