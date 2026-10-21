<script lang="ts">
	const { children, text, isActive = false, top = '-top-[calc(100%+4px)]' } = $props();
</script>

<section
	class="group relative cursor-[url('/svg/edit_pen.svg')_12_12,pointer] rounded-lg border border-dashed border-transparent transition-all duration-200
		  hover:border-gray-300 hover:bg-gray-100 hover:text-[#111828] active:border-gray-500 active:bg-[#e5e7eb]
			{isActive ? '' : ''}"
>
	{@render children()}
	<div
		class="absolute animate-fade-in {top} left-1/2 z-0 hidden w-fit -translate-x-1/2 items-center justify-center rounded-lg border border-gray-500 bg-gray-900
		px-2 py-1 text-xs font-medium text-nowrap text-gray-50 shadow-popover outline-hidden transition-all duration-200 group-hover:flex"
	>
		{text}
	</div>
</section>
