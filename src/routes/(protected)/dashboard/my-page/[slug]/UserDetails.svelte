<script>
	import { booking_store } from '$lib/client/client-state/booking.svelte';
	import { UserPlus } from '@lucide/svelte';
</script>

<div class="grid gap-2.5 text-sm">
	<section class="grid gap-1.5">
		<label for="name" class="font-medium text-gray-900">Your name</label>
		<input
			class="h-9 rounded-lg border border-gray-500"
			bind:value={booking_store.booking_user_details.name}
			type="text"
		/>
	</section>
	<section class="grid gap-1.5">
		<label for="address" class="font-medium text-gray-900">Your address</label>
		<input
			class="h-9 rounded-lg border border-gray-500"
			bind:value={booking_store.booking_user_details.address}
			type="text"
		/>
	</section>

	<section class="grid gap-1.5">
		<label for="additonalnote" class="font-medium text-gray-900"> Additional Note</label>
		<textarea
			class="max-h-50 min-h-20 rounded-lg"
			bind:value={booking_store.booking_user_details.additional_notes}></textarea>
	</section>
	<section class="grid gap-1.5">
		<button
			class="flex w-fit cursor-pointer items-center gap-1.5 rounded-lg bg-gray-200 px-2 py-1.5 text-gray-900"
		>
			<UserPlus size="14" font-weight="3" class="" />
			<span> Add Guests</span>
		</button>
		<label for="addguest" class=" text-gray-900">Add Guests</label>
	</section>
	<section class="flex justify-end">
		<button
			class="rounded-lg border border-gray-500 bg-gray-800 px-2 py-1.5 text-white hover:bg-black"
			>Confim</button
		>
	</section>
</div>
