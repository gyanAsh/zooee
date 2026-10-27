<script lang="ts">
	import { booking_store, type Weekday } from '$lib/client/client-state/booking.svelte.js';
	import { LucideChevronLeft, LucideChevronRight } from '@lucide/svelte';

	const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
	const weekday_names: Weekday[] = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday'
	];
	const month_names = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	const today = new Date();
	const today_start = new Date(today.getFullYear(), today.getMonth(), today.getDate());

	const initial_view =
		booking_store.booking_date.day > 0 && booking_store.booking_date.year > 0
			? new Date(
					booking_store.booking_date.year,
					booking_store.booking_date.month - 1,
					booking_store.booking_date.day
				)
			: today;

	let view_year = $state(initial_view.getFullYear());
	let view_month = $state(initial_view.getMonth());

	const first_weekday = $derived(new Date(view_year, view_month, 1).getDay());
	const days_in_month = $derived(new Date(view_year, view_month + 1, 0).getDate());
	const cells = $derived.by(() => {
		const days: (number | null)[] = Array.from({ length: first_weekday }, () => null);
		for (let day = 1; day <= days_in_month; day++) days.push(day);
		return days;
	});

	const can_go_back = $derived(
		view_year > today.getFullYear() ||
			(view_year === today.getFullYear() && view_month > today.getMonth())
	);

	function change_month(offset: number) {
		const next = new Date(view_year, view_month + offset, 1);
		view_year = next.getFullYear();
		view_month = next.getMonth();
	}

	function is_past(day: number) {
		return new Date(view_year, view_month, day) < today_start;
	}

	function is_today(day: number) {
		return (
			view_year === today.getFullYear() &&
			view_month === today.getMonth() &&
			day === today.getDate()
		);
	}

	function is_selected(day: number) {
		return (
			booking_store.booking_date.day === day &&
			booking_store.booking_date.month === view_month + 1 &&
			booking_store.booking_date.year === view_year
		);
	}

	function select_date(day: number) {
		const date = new Date(view_year, view_month, day);
		booking_store.booking_date = {
			day,
			month: view_month + 1,
			year: view_year,
			week: weekday_names[date.getDay()]
		};
	}
</script>

<section class="flex flex-col justify-start gap-2.5 text-sm">
	<div class="flex h-fit justify-between">
		<button
			type="button"
			class="rounded-lg border p-1.5 transition-colors duration-75 ease-in enabled:cursor-pointer enabled:hover:bg-zinc-500
			enabled:hover:text-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
			aria-label="Previous month"
			disabled={!can_go_back}
			onclick={() => change_month(-1)}
		>
			<LucideChevronLeft size="16" strokeWidth="2.5" />
		</button>
		<h2 class="text-gray-900" aria-live="polite">{month_names[view_month]} {view_year}</h2>
		<button
			type="button"
			class="cursor-pointer rounded-lg border p-1.5 transition-colors duration-75 ease-in hover:bg-zinc-500
			hover:text-gray-50"
			aria-label="Next month"
			onclick={() => change_month(1)}
		>
			<LucideChevronRight size="16" strokeWidth="2.5" />
		</button>
	</div>
	<div class="grid grid-cols-7 gap-1.5 font-bold">
		{#each weekdays as day (day)}
			<h2 class="col-span-1 mb-1 text-center text-xs">{day}</h2>
		{/each}
		{#each cells as date, index (`${view_year}-${view_month}-${index}`)}
			{#if date === null}
				<p class="col-span-1 aspect-square w-full"></p>
			{:else}
				{@const selected = is_selected(date)}
				{@const disabled = is_past(date)}
				{@const current = is_today(date)}
				<button
					type="button"
					class="relative col-span-1 flex aspect-square w-full items-center justify-center rounded-lg border
					text-center transition-all duration-75 ease-in
						{selected
						? 'bg-gray-900 text-gray-50 hover:bg-gray-900'
						: disabled
							? 'cursor-not-allowed bg-[#E0DED9]/30 text-gray-400'
							: 'cursor-pointer bg-[#E0DED9]/30 hover:bg-zinc-500 hover:text-gray-50'}"
					aria-label="{month_names[view_month]} {date}, {view_year}{current ? ' (today)' : ''}"
					aria-pressed={selected}
					{disabled}
					onclick={() => select_date(date)}
				>
					{#if current}
						<span
							class="absolute top-1 right-0 size-1.5 -translate-x-1/2 rounded-full bg-red-500"
							aria-hidden="true"
						></span>
					{/if}
					{date}
				</button>
			{/if}
		{/each}
	</div>
</section>
