<script lang="ts">
	import { fly } from 'svelte/transition';
	import AppointmentInfo from './AppointmentInfo.svelte';
	import Calender from './Calender.svelte';
	import TimeSlot from './TimeSlot.svelte';
	import { cubicOut } from 'svelte/easing';

	let tab_state = $state<'booking' | 'user_details'>('booking');
</script>

<section
	style="background: radial-gradient(125% 125% at 50% 10%, #000 40%, #6366f1 100%);"
	class="scrollbar-custom flex h-full justify-center overflow-auto rounded-sm"
	in:fly={{ y: -10, duration: 130, easing: cubicOut }}
>
	<div
		class="my-auto grid aspect-10/5 w-full max-w-4xl grid-cols-12 gap-5 bg-white p-5 shadow-2xl md:mx-5 md:rounded-lg md:border"
	>
		<section class=" col-span-12 md:col-span-4">
			<AppointmentInfo />
		</section>
		<section class="col-span-12 flex flex-col gap-5 md:col-span-8">
			<div class="text-sm">
				<section class="grid grid-cols-2 gap-1.5">
					<button
						data-selected={tab_state === 'booking'}
						class="cursor-pointer border px-2 py-1.5
						data-[selected=true]:bg-gray-900 data-[selected=true]:text-gray-50"
						onclick={() => (tab_state = 'booking')}>Select Date & Time</button
					>
					<button
						data-selected={tab_state === 'user_details'}
						class="cursor-pointer border px-2 py-1.5
						data-[selected=true]:bg-gray-900 data-[selected=true]:text-gray-50"
						onclick={() => (tab_state = 'user_details')}>Fill Details</button
					>
				</section>
			</div>
			{#if tab_state === 'booking'}
				<div class="grid gap-5 sm:grid-cols-8">
					<section class="grid gap-2.5 sm:col-span-6">
						<Calender />
					</section>
					<section class="sm:col-span-2">
						<TimeSlot />
					</section>
				</div>
			{:else if tab_state === 'user_details'}
				<div class="grid gap-5 text-sm">
					<section class="grid gap-1.5">
						<label for="name" class="">Your name</label>
						<input class="rounded-lg" />
					</section>
					<section class="grid gap-1.5">
						<label for="address">Your address</label>
						<input class="rounded-lg" />
					</section>

					<section class="grid gap-1.5">
						<label for="additonalnote"> Additional Note</label>
						<textarea class="max-h-400 rounded-lg"></textarea>
					</section>
					<section class="flex justify-end">
						<button class="rounded-lg bg-gray-800 px-2 py-1.5 text-white hover:bg-black"
							>Confim</button
						>
					</section>
				</div>
			{/if}
		</section>
	</div>
</section>

<!-- these sections below are draggable ( order can be changed in the dashboard ) -->
<!-- <section>
			<button>Add anouncements/discounts</button>
			<button>Connect Google Calender For appointemtns</button>
			<button>Add Products</button>
		</section>
		<section>
			<button>Add Links</button>
		</section> -->
