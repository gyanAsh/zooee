<script lang="ts">
	import { Image } from 'svelte-konva';
	import type { KonvaEventObject } from 'konva/lib/Node';
	import { stage_state } from '$lib/client-state/moodboard/konva.svelte.js';
	import type { ImageDimensions } from '$lib/client-state/moodboard/image.svelte.js';
	import { useImage } from '$lib/utils/image.svelte.js';
	import { untrack } from 'svelte';
	import { handleHover } from '$lib/utils/shape.svelte.js';

	interface ComponentProps {
		img: ImageDimensions;
		id: string;
	}

	let { img = $bindable(), id }: ComponentProps = $props();

	let x = $derived(
		img.position === 'left'
			? img.awayFromSide
			: img.position === 'right'
				? stage_state.current.width - img.width - img.awayFromSide
				: stage_state.current.width / 2 - img.awayFromSide - img.width / 2
	);
	let y = $derived(img.awayFromTop);

	const image = useImage(img.url, img.crossOrigin);

	$effect(() => {
		if (image.status !== 'loaded') return;
		const { width, height } = image.size;

		untrack(() => {
			if (img.newImage == true) {
				img.width = width;
				img.height = height;
				img.newImage = false;
			}
		});
	});

	const onTransformEnd = (e: KonvaEventObject<DragEvent>) => {
		const node = e.target;

		const scaleX = node.scaleX();
		const scaleY = node.scaleY();
		const newWidth = Math.max(5, node.width() * scaleX);
		const newHeight = Math.max(5, node.height() * scaleY);

		// Reset scale
		node.scaleX(1);
		node.scaleY(1);

		img.awayFromSide =
			img.position === 'left'
				? node.x()
				: img.position === 'right'
					? stage_state.current.width - newWidth - node.x()
					: stage_state.current.width / 2 - node.x() - newWidth / 2;
		img.awayFromTop = node.y();
		img.width = newWidth;
		img.height = newHeight;
		img.rotation = node.rotation();
	};
</script>

<Image
	{x}
	{y}
	{id}
	image={image.current}
	width={img.width}
	height={img.height}
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
	onmouseenter={(e: KonvaEventObject<MouseEvent>) => handleHover(e, true)}
	onmouseleave={(e: KonvaEventObject<MouseEvent>) => handleHover(e, false)}
	ontransformend={onTransformEnd}
/>
