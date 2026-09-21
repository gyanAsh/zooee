<script lang="ts">
	import BottomLayout from './BottomLayout.svelte';
	import LeftLayout from './LeftLayout.svelte';
	import RightLayout from './RightLayout.svelte';
	import TopLayout from './TopLayout.svelte';

	const { children } = $props();
</script>

<div class="relative grid min-h-dvh bg-amber-700">
	<TopLayout />
	<LeftLayout />
	<div class="grow">{@render children()}</div>
	<RightLayout />
	<BottomLayout />
</div>
