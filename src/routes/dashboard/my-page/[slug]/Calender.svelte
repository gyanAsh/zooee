<script>
	import { LucideChevronLeft, LucideChevronRight } from '@lucide/svelte';
	let dates = [
		'null1',
		'null2',
		'null3',
		'null4',
		'null5',
		'null6',
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		10,
		11,
		12,
		13,
		14,
		15,
		16,
		17,
		18,
		19,
		20,
		21,
		22,
		23,
		24,
		25,
		26,
		27,
		28,
		29,
		30,
		31
	];
	let weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
</script>

<section class="grid gap-2.5 text-sm">
	<div class="flex items-center justify-between">
		<button class="rounded-lg border p-1.5">
			<LucideChevronLeft size="16" strokeWidth="2.5" />
		</button>
		<h2 class=" text-gray-900">October 2026</h2>
		<button class="rounded-lg border p-1.5">
			<LucideChevronRight size="16" strokeWidth="2.5" />
		</button>
	</div>
	<div class="grid grid-cols-7 gap-1.5 font-bold">
		{#each weekdays as day (day)}
			<h2 class="col-span-1 mb-1 text-center text-xs">{day}</h2>
		{/each}
		{#each dates as date (date)}
			{#if typeof date === 'number'}
				<p
					class="col-span-1 aspect-square w-full cursor-pointer content-center rounded-lg bg-gray-100
						text-center text-gray-900 transition-all duration-75 ease-in hover:bg-gray-900 hover:text-gray-50"
				>
					{date}
				</p>
			{:else}
				<p class=" col-span-1 aspect-square w-full content-center rounded-lg text-center"></p>
			{/if}
		{/each}
	</div>
</section>
