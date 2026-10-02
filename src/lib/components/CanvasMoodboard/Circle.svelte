<script lang="ts">
	import { Ellipse } from 'svelte-konva';
	import type { KonvaEventObject } from 'konva/lib/Node';
	import { stage_state } from '$lib/client-state/moodboard/konva.svelte';
	import { handleHover } from '$lib/utils/shape.svelte';
	import type { CircleDimensions } from '$lib/client-state/moodboard/circle.svelte';
	import Konva from 'konva';

	interface ComponentProps {
		circle: CircleDimensions;
		id: string;
	}

	const { circle = $bindable(), id }: ComponentProps = $props();

	let x = $derived(
		circle.position === 'left'
			? circle.awayFromSide
			: circle.position === 'right'
				? stage_state.current.width - circle.radiusX * 2 - circle.awayFromSide
				: stage_state.current.width / 2 - circle.awayFromSide - circle.radiusX
	);
	let y = $derived(circle.awayFromTop);

	const onTransformEnd = (e: KonvaEventObject<DragEvent>) => {
		const node = e.target;

		const scaleX = node.scaleX();
		const scaleY = node.scaleY();
		const newWidth = Math.max(5, node.width() * scaleX);
		const newHeight = Math.max(5, node.height() * scaleY);

		// Reset scale
		node.scaleX(1);
		node.scaleY(1);

		circle.awayFromSide =
			circle.position === 'left'
				? node.x()
				: circle.position === 'right'
					? stage_state.current.width - newWidth - node.x()
					: stage_state.current.width / 2 - node.x() - newWidth / 2;
		circle.awayFromTop = node.y();
		circle.radiusX = newWidth / 2;
		circle.radiusY = newHeight / 2;
		circle.rotation = node.rotation();
	};
</script>

<Ellipse
	{x}
	{y}
	{id}
	draggable
	fill={circle.fill}
	radiusX={circle.radiusX}
	radiusY={circle.radiusY}
	rotation={circle.rotation}
	ondragend={(e: KonvaEventObject<DragEvent>) => {
		const node = e.target as Konva.Ellipse;

		circle.awayFromSide =
			circle.position === 'left'
				? node.x()
				: circle.position === 'right'
					? stage_state.current.width - node.width() - node.x()
					: stage_state.current.width / 2 - node.x() - node.width() / 2;
		circle.awayFromTop = node.y();
	}}
	onmouseenter={(e: KonvaEventObject<MouseEvent>) => handleHover(e, true)}
	onmouseleave={(e: KonvaEventObject<MouseEvent>) => handleHover(e, false)}
	ontransformend={onTransformEnd}
/>
