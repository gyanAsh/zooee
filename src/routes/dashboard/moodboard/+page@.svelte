<script lang="ts">
	import { stage_state, clips } from '$lib/client-state/moodboard/konva.svelte.js';
	import Rectange from '$lib/components/CanvasMoodboard/Rectange.svelte';
	import Mainlayout from './MainLayout.svelte';
	import { Stage, Layer } from 'svelte-konva';

	let container: HTMLDivElement;

	$effect(() => {
		const ro = new ResizeObserver(([entry]) => {
			// contentRect excludes padding/border
			stage_state.current.width = entry.contentRect.width;
			stage_state.current.height = entry.contentRect.height;
		});
		ro.observe(container);
		return () => ro.disconnect();
	});
</script>

<Mainlayout>
	<div bind:this={container} style="width:100dvw; height:100dvh; position:relative;">
		<Stage width={stage_state.current.width} height={stage_state.current.height}>
			<Layer>
				{#each clips.current as clip (clip.id)}
					{#if clip.type === 'rect'}
						<Rectange rect={clip.attr} />
					{/if}
				{/each}
			</Layer>
		</Stage>
	</div>
</Mainlayout>
