<script lang="ts">
	import BottomLayout from './BottomLayout.svelte';
	import LeftLayout from './LeftLayout.svelte';
	import RightLayout from './RightLayout.svelte';
	import TopLayout from './TopLayout.svelte';

	const { children } = $props();
</script>

<div class="relative grid min-h-dvh bg-olive-50">
	<section class="z-9999">
		<BottomLayout />
		<LeftLayout />
		<RightLayout />
		<TopLayout />
	</section>

	<div class="grow">{@render children()}</div>
</div>
