<script lang="ts">
	import { stage_state, clips } from '$lib/client-state/moodboard/konva.svelte';
	import Rectange from '$lib/components/CanvasMoodboard/Rectange.svelte';
	import type Konva from 'konva';
	import Mainlayout from './MainLayout.svelte';
	import { Stage, Layer, Transformer, Rect } from 'svelte-konva';
	import { tick, type SvelteComponent } from 'svelte';
	import Image from '$lib/components/CanvasMoodboard/Image.svelte';
	import Text from '$lib/components/CanvasMoodboard/Text.svelte';
	import { stage_store as st } from '$lib/client-state/moodboard/stage.svelte';
	import {
		handleMouseDown,
		handleMouseMove,
		handleMouseUp,
		handleStageClick
	} from '$lib/utils/stage.svelte';
	import type { KonvaEventObject } from 'konva/lib/Node';
	interface Box {
		x: number;
		y: number;
		width: number;
		height: number;
		rotation: number; // in radians
	}
	let container: HTMLDivElement;
	let layerComp: SvelteComponent & { node: Konva.Layer };
	let transformerComp: SvelteComponent & { node: Konva.Transformer };

	const selection_rect_id = 'selection_rect_id';

	const onClick = (e: KonvaEventObject<DragEvent>) =>
		handleStageClick({
			e,
			selectionRect: st.selectionRect,
			selectedIds: st.selectedIds,
			setSelectedIds: (ids) => st.setSelectedIds(ids)
		});
	const onMouseDown = (e: KonvaEventObject<DragEvent>) =>
		handleMouseDown({
			e,
			setIsSelecting: (state) => st.setIsSelecting(state),
			setSelectionRect: (rect) => st.setSelectionRect(rect)
		});
	const onMouseMove = (e: KonvaEventObject<DragEvent>) =>
		handleMouseMove({
			e,
			isSelecting: st.isSelecting,
			selectionRect: st.selectionRect,
			setSelectionRect: (rect) => st.setSelectionRect(rect)
		});
	const onMouseUp = () =>
		handleMouseUp({
			isSelecting: st.isSelecting,
			setIsSelecting: (state) => st.setIsSelecting(state),
			setSelectedIds: (ids) => st.setSelectedIds(ids),
			selectionRect: st.selectionRect,
			setSelectionRect: (rect) => st.setSelectionRect(rect),
			layer: layerComp?.node,
			selectionRectId: selection_rect_id,
			itemsIds: clips.current.map((c) => c.id)
		});

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
		const order = clips.current.map((c) => c.id);

		tick().then(() => {
			for (const id of order) {
				const node = layer.findOne<Konva.Node>(`#${id}`);
				if (node && node.getParent() === layer) node.moveToTop();
				else console.error(`not found :${id}, node : ${node} , nodeparent : ${node?.getParent()}`);
			}
			layer.batchDraw();
		});
	});

	$effect(() => {
		if (!transformerComp || !layerComp) return;
		const layer = layerComp?.node;
		const transformer = transformerComp.node;
		let nodes: Konva.Node[] = [];
		for (const id of st.selectedIds) {
			const node = layer.findOne<Konva.Node>(`#${id}`);
			if (node && node.getParent() === layer) nodes.push(node);
			else console.error(`not found :${id}, node : ${node} , nodeparent : ${node?.getParent()}`);
		}
		transformer.nodes(nodes);
	});
</script>

<Mainlayout>
	<div bind:this={container} style="width:100dvw; height:100dvh; position:relative;">
		<Stage
			width={stage_state.current.width}
			height={stage_state.current.height}
			onclick={onClick}
			onTap={onClick}
			onmousedown={onMouseDown}
			ontouchstart={onMouseDown}
			onmousemove={onMouseMove}
			ontouchmove={onMouseMove}
			onmouseup={onMouseUp}
			ontouchend={onMouseUp}
		>
			<Layer bind:this={layerComp}>
				{#each clips.current as clip (clip.id)}
					{#if clip.type === 'rect'}
						<Rectange id={clip.id} bind:rect={clip.attr} />
					{:else if clip.type === 'img'}
						<Image id={clip.id} bind:img={clip.attr} />
					{:else if clip.type === 'text'}
						<Text id={clip.id} bind:txt={clip.attr} />
					{/if}
				{/each}
				<Transformer
					bind:this={transformerComp}
					boundboxfunc={(oldBox: Box, newBox: Box) => {
						//Limit resize
						if (newBox.width < 5 || newBox.height < 5) return oldBox;
						return newBox;
					}}
				/>
				{#if st.selectionRect.visible == true}
					<Rect
						id={selection_rect_id}
						x={Math.min(st.selectionRect.x1, st.selectionRect.x2)}
						y={Math.min(st.selectionRect.y1, st.selectionRect.y2)}
						width={Math.abs(st.selectionRect.x2 - st.selectionRect.x1)}
						height={Math.abs(st.selectionRect.y2 - st.selectionRect.y1)}
						fill="rgba(0,0,255,0.5)"
					/>
				{/if}
			</Layer>
		</Stage>
	</div>
</Mainlayout>
