<script lang="ts">
	import { left_layout_state } from '$lib/client-state/moodboard/leftlayout/index.svelte.js';
	import LayersModal from './LayersModal.svelte';
</script>

<section class="relative h-full bg-white">
	<div class="py-2">
		<button
			aria-label="layers"
			aria-pressed={left_layout_state.modal === 'layers'}
			class=" group group relative flex size-15 cursor-pointer flex-col items-center justify-center gap-0.5
		  text-gray-800/70 hover:text-gray-800 aria-pressed:text-gray-800"
			onclick={() => (left_layout_state.modal = 'layers')}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-layers preview-icon"
				><path
					d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"
				/><path
					d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"
				/><path
					d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"
				/></svg
			>
			<h2 class="text-xs font-medium group-hover:font-bold">Layers</h2>
		</button>

		<button
			aria-label="elements"
			aria-pressed={left_layout_state.modal === 'elements'}
			class=" group group relative flex size-15 cursor-pointer flex-col items-center justify-center gap-0.5
		  text-gray-800/70 hover:text-gray-800 aria-pressed:text-gray-800"
			onclick={() => (left_layout_state.modal = 'elements')}
		>
			<div class="grid grid-cols-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="10"
					height="10"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="4"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-circle preview-icon"><circle cx="12" cy="12" r="10" /></svg
				>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="10"
					height="10"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="4"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-triangle preview-icon"
					><path d="M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /></svg
				>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="10"
					height="10"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="4"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-square preview-icon"
					><rect width="18" height="18" x="3" y="3" rx="2" /></svg
				>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="10"
					height="10"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="4"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-heart preview-icon"
					><path
						d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"
					/></svg
				>
			</div>

			<h2 class="text-xs font-medium group-hover:font-bold">Elements</h2>
		</button>
		<button
			aria-label="template"
			aria-pressed={left_layout_state.modal === 'template'}
			class=" group group relative flex size-15 cursor-pointer flex-col items-center justify-center gap-0.5
		   text-gray-800/70 hover:text-gray-800 aria-pressed:text-gray-800"
			onclick={() => (left_layout_state.modal = 'template')}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-layout-dashboard preview-icon"
				><rect width="7" height="9" x="3" y="3" rx="1" /><rect
					width="7"
					height="5"
					x="14"
					y="3"
					rx="1"
				/><rect width="7" height="9" x="14" y="12" rx="1" /><rect
					width="7"
					height="5"
					x="3"
					y="16"
					rx="1"
				/></svg
			>
			<h2 class="text-xs font-medium group-hover:font-bold">Templates</h2>
		</button>
	</div>
	{#if left_layout_state.modal === 'layers'}
		<LayersModal />
	{/if}
</section>
