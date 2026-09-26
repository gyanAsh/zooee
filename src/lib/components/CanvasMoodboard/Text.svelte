<script lang="ts">
	import { Text } from 'svelte-konva';
	import type { KonvaEventObject } from 'konva/lib/Node';
	import { stage_state } from '$lib/client-state/moodboard/konva.svelte.js';
	import type { TextDimensions } from '$lib/client-state/moodboard/text.svelte.js';

	interface ComponentProps {
		txt: TextDimensions;
		id: string;
	}

	const { txt = $bindable(), id }: ComponentProps = $props();

	let x = $derived(
		txt.position === 'left'
			? txt.awayFromSide
			: txt.position === 'right'
				? stage_state.current.width - txt.width - txt.awayFromSide
				: stage_state.current.width / 2 - txt.awayFromSide - txt.width / 2
	);
	let y = $derived(txt.awayFromTop);
</script>

<Text
	{x}
	{y}
	{id}
	width={txt.width}
	height={txt.height}
	draggable
	fill={txt.fill}
	rotation={txt.rotation}
	text={txt.text}
	fontSize={txt.fontSize}
	fontFamily={txt.fontFamily}
	align={txt.align}
	ondragend={(e: KonvaEventObject<DragEvent>) => {
		txt.awayFromSide =
			txt.position === 'left'
				? e.target.x()
				: txt.position === 'right'
					? stage_state.current.width - e.target.width() - e.target.x()
					: stage_state.current.width / 2 - e.target.x() - e.target.width() / 2;
		txt.awayFromTop = e.target.y();
	}}
/>

<!-- const visualWidth = node.width() * node.scaleX();
const visualHeight = node.height() * node.scaleY(); -->
