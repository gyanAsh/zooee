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
					? stage_state.current.width - rect.width - e.target.x()
					: stage_state.current.width / 2 - e.target.x() - rect.width / 2;
		rect.awayFromTop = e.target.y();
	}}
/>
