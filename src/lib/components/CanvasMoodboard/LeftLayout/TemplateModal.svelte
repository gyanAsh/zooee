<script>
	import { left_layout_state } from '$lib/client-state/moodboard/leftlayout/index.svelte.js';
	import { cubicIn, cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
</script>

<section
	class="absolute top-0 left-20 flex h-full w-65 flex-col gap-2 border-r bg-white p-2"
	in:fly={{ x: -10, duration: 130, easing: cubicOut }}
	out:fly={{ x: -10, duration: 130, easing: cubicIn }}
>
	<div id="top" class="flex items-center justify-between">
		<div>
			<h2 class="text-sm font-medium">Templates</h2>
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
</section>
