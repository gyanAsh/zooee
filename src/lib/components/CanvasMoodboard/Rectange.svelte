<script lang="ts">
	import { Rect } from 'svelte-konva';
	import type { KonvaEventObject } from 'konva/lib/Node';
	import { stage_state } from '$lib/client-state/moodboard/konva.svelte.js';
	import type { RectDimensions } from '$lib/client-state/moodboard/rectangle.svelte.js';
	import { handleHover } from '$lib/utils/shape.svelte.js';

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
		const newWidth = Math.max(5, node.width() * scaleX);
		const newHeight = Math.max(5, node.height() * scaleY);

		// Reset scale
		node.scaleX(1);
		node.scaleY(1);

		rect.awayFromSide =
			rect.position === 'left'
				? node.x()
				: rect.position === 'right'
					? stage_state.current.width - newWidth - node.x()
					: stage_state.current.width / 2 - node.x() - newWidth / 2;
		rect.awayFromTop = node.y();
		rect.width = newWidth;
		rect.height = newHeight;
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
	onmouseenter={(e: KonvaEventObject<MouseEvent>) => handleHover(e, true)}
	onmouseleave={(e: KonvaEventObject<MouseEvent>) => handleHover(e, false)}
	ontransformend={onTransformEnd}
/>
