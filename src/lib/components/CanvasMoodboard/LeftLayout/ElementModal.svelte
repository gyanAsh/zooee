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
			<h2 class="text-sm font-medium">Elements</h2>
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
	<div class="grid grid-cols-3 gap-2">
		<div class="grid place-items-center gap-1 rounded-lg border p-2 text-xs">
			<div class="w-fit rounded-lg border bg-gray-100 p-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-type preview-icon"
					><path d="M12 4v16" /><path d="M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2" /><path
						d="M9 20h6"
					/></svg
				>
			</div>
			<h2>Text</h2>
		</div>
		<div class="grid place-items-center gap-1 rounded-lg border p-2 text-xs">
			<div class="w-fit rounded-lg border bg-gray-100 p-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-circle preview-icon"><circle cx="12" cy="12" r="10" /></svg
				>
			</div>
			<h2>Circle</h2>
		</div>
		<div class="grid place-items-center gap-1 rounded-lg border p-2 text-xs">
			<div class="w-fit rounded-lg border bg-gray-100 p-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-rectangle-horizontal preview-icon"
					><rect width="20" height="12" x="2" y="6" rx="2" /></svg
				>
			</div>
			<h2>Rectangle</h2>
		</div>
	</div>
</section>
