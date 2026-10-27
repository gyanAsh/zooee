<script lang="ts">
	import { booking_store } from '$lib/client/client-state/booking.svelte';
	import ScrollArea from '$lib/client/components/ui/scroll-area.svelte';

	const slots = [
		'04:00',
		'05:00',
		'06:00',
		'07:00',
		'08:00',
		'09:00',
		'10:00',
		'11:00',
		'12:00',
		'13:00',
		'14:00',
		'15:00',
		'16:00',
		'17:00',
		'18:00',
		'19:00',
		'20:00',
		'21:00',
		'22:00',
		'23:00',
		'24:00'
	];
</script>

<ScrollArea maxHeight="400px" width="100%">
	<section class="grid w-full gap-1.5 text-sm">
		{#each slots as slot (slot)}
			{@const [hours, minutes] = slot.split(':').map(Number)}
			{@const selected =
				booking_store.booking_slot.slot_mins === minutes &&
				booking_store.booking_slot.slot_hour === hours}
			<button
				class="w-full cursor-pointer rounded-lg border px-2 py-1.5 text-center hover:text-gray-50
				{selected ? 'bg-gray-900 text-gray-50 hover:bg-gray-900 ' : 'bg-[#E0DED9]/30 hover:bg-zinc-500 '}"
				onclick={() => {
					booking_store.booking_slot = {
						slot_format: '12h',
						slot_hour: hours,
						slot_mins: minutes
					};
				}}
			>
				{slot}
			</button>
		{/each}
	</section>
</ScrollArea>
