<script lang="ts">
	import { stage_state, clips } from '$lib/client-state/moodboard/konva.svelte.js';
	import Rectange from '$lib/components/CanvasMoodboard/Rectange.svelte';
	import type Konva from 'konva';
	import Mainlayout from './MainLayout.svelte';
	import { Stage, Layer } from 'svelte-konva';
	import { tick, type SvelteComponent } from 'svelte';
	import Image from '$lib/components/CanvasMoodboard/Image.svelte';

	let container: HTMLDivElement;
	let layerComp: SvelteComponent & { node: Konva.Layer };

	let clips_items = $derived(clips.current);

	$effect(() => {
		const ro = new ResizeObserver(([entry]) => {
			// contentRect excludes padding/border
			stage_state.current.width = entry.contentRect.width;
			stage_state.current.height = entry.contentRect.height;
		});
		ro.observe(container);
		return () => ro.disconnect();
	});
	$effect(() => {
		const layer = layerComp?.node;
		if (!layer) return;
		const order = clips_items.map((c) => c.id);

		tick().then(() => {
			for (const id of order) {
				const node = layer.findOne<Konva.Node>(`#${id}`);
				if (node && node.getParent() === layer) node.moveToTop();
				else console.error(`not found :${id}, node : ${node} , nodeparent : ${node?.getParent()}`);
			}
			layer.batchDraw();
		});
	});
</script>

<Mainlayout>
	<div bind:this={container} style="width:100dvw; height:100dvh; position:relative;">
		<Stage width={stage_state.current.width} height={stage_state.current.height}>
			<Layer bind:this={layerComp}>
				{#each clips_items as clip (clip.id)}
					{#if clip.type === 'rect'}
						<Rectange id={clip.id} bind:rect={clip.attr} />
					{:else if clip.type === 'img'}
						<Image id={clip.id} bind:img={clip.attr} />
					{/if}
				{/each}
			</Layer>
		</Stage>
	</div>
</Mainlayout>
