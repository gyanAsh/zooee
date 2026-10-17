<script lang="ts">
	import { fly } from 'svelte/transition';
	import AppointmentInfo from './AppointmentInfo.svelte';
	import Calender from './Calender.svelte';
	import TimeSlot from './TimeSlot.svelte';
	import { cubicOut } from 'svelte/easing';
	import UserDetails from './UserDetails.svelte';
	import { Plus, Settings } from '@lucide/svelte';

	let tab_state = $state<'booking' | 'user_details'>('booking');
</script>

<section
	class="scrollbar-custom relative flex h-full justify-center overflow-auto rounded-sm bg-[#E0DED9]"
	in:fly={{ y: -10, duration: 130, easing: cubicOut }}
>
	<section
		class="absolute top-0 flex h-fit w-fit items-center justify-center gap-2.5 rounded-b-2xl border-x border-b bg-gray-50 p-2"
	>
		<button
			class="inline-flex cursor-pointer items-center justify-center gap-1 rounded-lg border border-purple-300 bg-purple-200 px-2 py-1.5 text-xs font-medium text-gray-800"
		>
			<Settings size="14" strokeWidth="2" />
			<span> Customize Page </span>
		</button>
		<div class="my-0.5 w-[1.5px] self-stretch rounded-full bg-gray-300"></div>
		<button
			class="inline-flex cursor-pointer items-center justify-center gap-1 rounded-lg bg-blue-500 px-2 py-1.5 text-xs font-medium text-gray-50"
		>
			<Plus class="" size="12" strokeWidth="2" />
			<span>Add Booking Link</span>
		</button>
	</section>
	<div
		class="my-auto grid aspect-10/5 w-full max-w-4xl grid-cols-12 gap-5 bg-[#FCFBF7] p-5 shadow-2xl md:mx-5 md:rounded-4xl md:border"
	>
		<section class=" col-span-12 md:col-span-4">
			<AppointmentInfo />
		</section>
		<section class="col-span-12 flex flex-col gap-5 md:col-span-8">
			<div class="text-sm">
				<section class="grid grid-cols-2">
					<button
						data-selected={tab_state === 'booking'}
						class="cursor-pointer rounded-lg border px-2 py-1.5
						data-[selected=true]:bg-gray-900 data-[selected=true]:text-gray-50"
						onclick={() => (tab_state = 'booking')}>Select Date & Time</button
					>
					<button
						data-selected={tab_state === 'user_details'}
						class="cursor-pointer rounded-lg border px-2 py-1.5
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
				<UserDetails />
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
