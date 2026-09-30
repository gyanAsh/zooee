<script lang="ts">
	import { clips, type ClipItem } from '$lib/client-state/moodboard/konva.svelte.js';
	import { left_layout_state } from '$lib/client-state/moodboard/leftlayout/index.svelte.js';
	import { flip } from 'svelte/animate';
	import { cubicIn, cubicOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';

	let reverse_clips = $derived([...clips.current].reverse());

	function onchange(updated_rev_clips: ClipItem[]) {
		clips.current = [...updated_rev_clips].reverse();
	}

	let draggingIndex = $state<number | null>(null);
	let overIndex = $state<number | null>(null);

	const isDragging = $derived(draggingIndex !== null);

	function handleDragStart(index: number, e: DragEvent) {
		draggingIndex = index;
		if (!e.dataTransfer) return;
		e.dataTransfer.effectAllowed = 'move';
		// Required for Firefox
		e.dataTransfer.setData('text/plain', String(index));
	}

	function handleDragOver(index: number, e: DragEvent) {
		e.preventDefault();
		if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
		if (draggingIndex === null || index === draggingIndex) return;
		overIndex = index;
	}

	function handleDragLeave() {
		overIndex = null;
	}

	function handleDrop(index: number, e: DragEvent) {
		e.preventDefault();
		if (draggingIndex === null || draggingIndex === index) {
			reset();
			return;
		}

		const next = [...reverse_clips];
		const [moved] = next.splice(draggingIndex, 1);

		next.splice(index, 0, moved);

		reverse_clips = next;
		onchange?.(next);
		reset();
	}

	function handleDragEnd() {
		reset();
	}

	function move(from: number, to: number) {
		if (to < 0 || to >= reverse_clips.length) return;
		const next = [...reverse_clips];
		const [item] = next.splice(from, 1);
		next.splice(to, 0, item);
		reverse_clips = next;
		onchange?.(next);
	}

	function handleKeydown(e: KeyboardEvent, i: number) {
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			move(i, i - 1);
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			move(i, i + 1);
		}
	}

	function reset() {
		draggingIndex = null;
		overIndex = null;
	}
</script>

<!-- Component flies in from the left (-x) and out to the right (+x) -->

<section
	class="absolute top-0 left-20 flex h-full w-65 flex-col gap-2 border-r p-2 {isDragging
		? 'bg-gray-50'
		: 'bg-white'}"
	in:fly={{ x: -10, duration: 130, easing: cubicOut }}
	out:fly={{ x: -10, duration: 130, easing: cubicIn }}
>
	<div id="top" class="flex items-center justify-between">
		<div>
			<h2 class="text-sm font-medium">Layers</h2>
		</div>
		<button
			aria-label="close"
			class="cursor-pointer rounded-lg border p-1 duration-75 ease-in hover:bg-gray-200"
			onclick={() => (left_layout_state.modal = 'close')}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-x preview-icon"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg
			>
		</button>
	</div>

	<div class="grid">
		{#each reverse_clips as clip, i (clip.id)}
			<button
				animate:flip={{ duration: 200 }}
				in:fade={{ duration: 150 }}
				out:fade={{ duration: 150 }}
				draggable="true"
				tabindex="0"
				ondragstart={(e) => handleDragStart(i, e)}
				ondragover={(e) => handleDragOver(i, e)}
				ondragleave={handleDragLeave}
				ondrop={(e) => handleDrop(i, e)}
				ondragend={handleDragEnd}
				onkeydown={(e) => handleKeydown(e, i)}
				aria-grabbed={draggingIndex === i}
				class="py-0.5"
			>
				<span
					class="group flex cursor-grab items-center gap-3
					rounded-lg border-2 border-gray-200 bg-gray-200 px-4
					py-2 text-slate-800
					transition-all duration-150
					select-none hover:border-blue-800
					hover:bg-blue-200/70 focus:outline-none focus-visible:ring-2
					focus-visible:ring-sky-400 active:cursor-grabbing

					{typeof overIndex !== 'number' || typeof draggingIndex !== 'number' || overIndex === draggingIndex
						? ''
						: overIndex < draggingIndex
							? overIndex > i
								? '-translate-y-1 duration-75 ease-in'
								: 'translate-y-1 duration-75 ease-in'
							: overIndex > i - 1
								? '-translate-y-1 duration-75 ease-in'
								: 'translate-y-1 duration-75 ease-in'}

					{draggingIndex === i
						? 'my-2 scale-[0.98] -rotate-2 border-dashed border-sky-500 opacity-40 shadow-lg'
						: ''}

					{typeof overIndex !== 'number' || typeof draggingIndex !== 'number' || overIndex === draggingIndex
						? ''
						: overIndex > draggingIndex
							? overIndex == i
								? 'border-b-blue-700'
								: overIndex == i - 1
									? 'border-t-blue-700'
									: ''
							: overIndex == i
								? 'border-t-blue-700'
								: overIndex == i + 1
									? 'border-b-blue-700'
									: ''}"
				>
					<span
						aria-hidden="true"
						class="text-sm tracking-[-2px] text-slate-600 transition-colors select-none
               group-hover:text-slate-900 hover:font-bold"
					>
						⋮ ⋮ ⋮
					</span>
					<span class="flex-1 text-start text-sm capitalize">
						{clip.type} {clip.type === 'rect' ? ` - ${clip.attr.fill}` : ''}</span
					>
				</span>
			</button>
		{/each}
	</div>
</section>
