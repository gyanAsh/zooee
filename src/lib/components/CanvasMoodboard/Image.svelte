<script lang="ts">
	import { Image } from 'svelte-konva';
	import type { KonvaEventObject } from 'konva/lib/Node';
	import { stage_state } from '$lib/client-state/moodboard/konva.svelte.js';
	import type { ImageDimensions } from '$lib/client-state/moodboard/image.svelte.js';
	import { useImage } from '$lib/utils/image.svelte.js';

	interface ComponentProps {
		img: ImageDimensions;
		id: string;
	}

	const { img = $bindable(), id }: ComponentProps = $props();

	let x = $derived(
		img.position === 'left'
			? img.awayFromSide
			: img.position === 'right'
				? stage_state.current.width - img.width - img.awayFromSide
				: stage_state.current.width / 2 - img.awayFromSide - img.width / 2
	);
	let y = $derived(img.awayFromTop);

	const image = useImage(img.url, img.crossOrigin);
	let img_width = $derived(image.status === 'loaded' ? image.size.width : img.width);
	let img_height = $derived(image.status === 'loaded' ? image.size.height : img.height);
</script>

<Image
	{x}
	{y}
	{id}
	image={image.current}
	width={img_width}
	height={img_height}
	draggable
	fill={img.fill}
	rotation={img.rotation}
	ondragend={(e: KonvaEventObject<DragEvent>) => {
		img.awayFromSide =
			img.position === 'left'
				? e.target.x()
				: img.position === 'right'
					? stage_state.current.width - img.width - e.target.x()
					: stage_state.current.width / 2 - e.target.x() - img.width / 2;
		img.awayFromTop = e.target.y();
	}}
/>
