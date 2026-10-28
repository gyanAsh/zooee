<script lang="ts">
	import { booking_store, type Weekday } from '$lib/client/client-state/booking.svelte.js';
	import { LucideChevronLeft, LucideChevronRight } from '@lucide/svelte';
	import {
		addMonths,
		format,
		getDay,
		getDaysInMonth,
		getMonth,
		getYear,
		isBefore,
		isSameDay,
		startOfMonth
	} from 'date-fns';

	const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

	const today_start = $derived(
		new Date(booking_store.today.year, booking_store.today.month - 1, booking_store.today.day)
	);

	function get_selected_date() {
		if (booking_store.booking_date.day > 0 && booking_store.booking_date.year > 0) {
			return new Date(
				booking_store.booking_date.year,
				booking_store.booking_date.month - 1,
				booking_store.booking_date.day
			);
		}

		return today_start;
	}

	let view_date = $state(get_selected_date());
	const view_year = $derived(getYear(view_date));
	const view_month = $derived(getMonth(view_date));

	const month_label = $derived(format(view_date, 'MMMM yyyy'));
	const first_weekday = $derived(getDay(startOfMonth(view_date)));
	const days_in_month = $derived(getDaysInMonth(view_date));
	const cells = $derived.by(() => {
		const days: (number | null)[] = Array.from({ length: first_weekday }, () => null);
		for (let day = 1; day <= days_in_month; day++) days.push(day);
		return days;
	});

	const can_go_back = $derived(isBefore(startOfMonth(today_start), startOfMonth(view_date)));

	function change_month(offset: number) {
		view_date = addMonths(view_date, offset);
	}

	function date_in_view(day: number) {
		return new Date(view_year, view_month, day);
	}

	function is_past(day: number) {
		return isBefore(date_in_view(day), today_start);
	}

	function is_today(day: number) {
		return isSameDay(date_in_view(day), today_start);
	}

	function is_selected(day: number) {
		return (
			booking_store.booking_date.day === day &&
			booking_store.booking_date.month === view_month + 1 &&
			booking_store.booking_date.year === view_year
		);
	}

	function select_date(day: number) {
		const date = date_in_view(day);
		booking_store.booking_date = {
			day,
			month: view_month + 1,
			year: view_year,
			week: format(date, 'EEEE') as Weekday
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
		<h2 class="text-gray-900" aria-live="polite">{month_label}</h2>
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
		<section class="col-span-7 grid grid-cols-7 grid-rows-6 gap-1.5">
			{#each cells as date, index (`${view_year}-${view_month}-${index}`)}
				{#if date === null}
					<p class="col-span-1 aspect-square w-full"></p>
				{:else}
					{@const selected = is_selected(date)}
					{@const disabled = is_past(date)}
					{@const current = is_today(date)}
					{@const cell_date = date_in_view(date)}
					<button
						type="button"
						class="relative col-span-1 flex aspect-square w-full items-center justify-center rounded-lg border
					text-center transition-all duration-75 ease-in
						{selected
							? 'bg-gray-900 text-gray-50 hover:bg-gray-900'
							: disabled
								? 'cursor-not-allowed bg-[#E0DED9]/30 text-gray-400'
								: 'cursor-pointer bg-[#E0DED9]/30 hover:bg-zinc-500 hover:text-gray-50'}"
						aria-label={format(cell_date, 'MMMM d, yyyy') + (current ? ' (today)' : '')}
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
		</section>
	</div>
</section>
