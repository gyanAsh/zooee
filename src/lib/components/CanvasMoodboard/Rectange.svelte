<script lang="ts">
	import { Rect } from 'svelte-konva';
	import type { KonvaEventObject } from 'konva/lib/Node';
	import { stage_state } from '$lib/client-state/moodboard/konva.svelte.js';
	import type { RectDimensions } from '$lib/client-state/moodboard/rectangle.svelte.js';

	interface ComponentProps {
		rect: RectDimensions;
		id: string;
	}

	const { rect = $bindable(), id }: ComponentProps = $props();

	let x = $derived(
		rect.position === 'left'
			? rect.awayFromSide
			: rect.position === 'right'
				? stage_state.current.width - rect.width - rect.awayFromSide
				: stage_state.current.width / 2 - rect.awayFromSide - rect.width / 2
	);
	let y = $derived(rect.awayFromTop);

	const onTransformEnd = (e: KonvaEventObject<DragEvent>) => {
		const node = e.target;

		const scaleX = node.scaleX();
		const scaleY = node.scaleY();

		// Reset scale
		node.scaleX(1);
		node.scaleY(1);

		rect.awayFromSide = node.x();
		rect.awayFromTop = node.y();
		rect.width = Math.max(5, node.width() * scaleX);
		rect.height = Math.max(5, node.height() * scaleY);
		rect.rotation = node.rotation();
	};
</script>

<Rect
	{x}
	{y}
	{id}
	width={rect.width}
	height={rect.height}
	draggable
	fill={rect.fill}
	rotation={rect.rotation}
	ondragend={(e: KonvaEventObject<DragEvent>) => {
		rect.awayFromSide =
			rect.position === 'left'
				? e.target.x()
				: rect.position === 'right'
					? stage_state.current.width - e.target.width() - e.target.x()
					: stage_state.current.width / 2 - e.target.x() - e.target.width() / 2;
		rect.awayFromTop = e.target.y();
	}}
	ontransformend={onTransformEnd}
/>
