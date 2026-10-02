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
		handleStageClick,
		transform_border_color
	} from '$lib/utils/stage.svelte';
	import type { KonvaEventObject } from 'konva/lib/Node';
	import Circle from '$lib/components/CanvasMoodboard/Circle.svelte';
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
		const transformer = transformerComp?.node;
		if (!layer || !transformer) return;

		// Snapshot reactive sources *synchronously* so they're tracked.
		const order = clips.current.map((c) => c.id);
		const selectedIds = st.selectedIds;

		tick().then(() => {
			// eslint-disable-next-line svelte/prefer-svelte-reactivity
			const cache = new Map<string, Konva.Node | undefined>();
			const lookup = (id: string) => {
				if (!cache.has(id)) cache.set(id, layer.findOne<Konva.Node>(`#${id}`));
				return cache.get(id);
			};

			for (const id of order) {
				const node = lookup(id);
				if (node?.getParent() === layer) node.moveToTop();
			}

			const nodes: Konva.Node[] = [];
			for (const id of selectedIds) {
				const node = lookup(id);
				if (node?.getParent() === layer) nodes.push(node);
			}

			transformer.nodes(nodes);
			if (nodes.length > 0) transformer.moveToTop();
			layer.batchDraw();
		});
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
					{:else if clip.type === 'circle'}
						<Circle id={clip.id} bind:circle={clip.attr} />
					{/if}
				{/each}

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
				<Transformer
					bind:this={transformerComp}
					boundBoxFunc={(oldBox: Box, newBox: Box) => {
						//Limit resize
						if (newBox.width < 5 || newBox.height < 5) return oldBox;
						return newBox;
					}}
					enabledAnchors={[
						'top-left',
						'top-right',
						'bottom-left',
						'bottom-right',
						'middle-right',
						'middle-left'
					]}
					borderStroke={transform_border_color}
					borderStrokeWidth={1.5}
					anchorSize={12}
					anchorStroke={transform_border_color}
					anchorFill={transform_border_color}
					rotationSnaps={[0, 90, 180, 270]}
					rotationSnapTolerance={5}
					anchorStyleFunc={(anchor: Konva.Rect) => {
						// 1. Make all anchors circles
						anchor.cornerRadius(10);

						// 2. Set the pink color
						anchor.fill('white');
						anchor.stroke(transform_border_color);
						anchor.strokeWidth(2);

						// 3. Prevent the stroke from scaling weirdly on the pill shape
						anchor.strokeScaleEnabled(false);

						// 4. Make the middle-right anchor a vertical pill
						if (anchor.hasName('middle-right') || anchor.hasName('middle-left')) {
							let height = 44;
							// Scale x to make it thinner, y to make it taller
							anchor.height(height);
							anchor.scale({ x: 0.7, y: 1 });
							anchor.offsetY(height / 2);
							anchor.cornerRadius([5, 5, 5, 5]);
						}
					}}
				/>
			</Layer>
		</Stage>
	</div>
</Mainlayout>
<!-- borderDash={[6, 4]} -->
