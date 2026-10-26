<script lang="ts">
	import { booking_store } from '$lib/client/client-state/booking.svelte';
	import ScrollArea from '$lib/client/components/ui/scroll-area.svelte';
	import Tooltip from '$lib/client/components/ui/tooltip.svelte';
	import { BriefcaseBusiness, Clock, MapPin } from '@lucide/svelte';

	type PropTypes = {
		name: string;
		bio: string | null;
		description: string | null;
		title: string;
		duration: number;
	};

	let { name, bio, description, title, duration }: PropTypes = $props();
</script>

<section class="flex h-full flex-col gap-5 text-sm">
	<div class="grid gap-0.5">
		<img
			src="https://framerusercontent.com/images/GPMWO2lffxJQOSExK7qFWyv6M.jpg?width=200"
			alt="temp_profile_img"
			class="aspect-square size-15 rounded-2xl border-2 border-gray-50 bg-gray-50 object-cover md:size-20"
		/>
		<h1 class="truncate font-bold text-gray-800">
			{name}
		</h1>
		{#if bio && bio.length > 60}
			<Tooltip text={bio}>
				<h2 class="line-clamp-2 text-start font-medium text-ellipsis text-gray-500">{bio}</h2>
			</Tooltip>
		{:else if bio}
			<h2 class="line-clamp-2 text-start font-medium text-ellipsis text-gray-500">{bio}</h2>
		{/if}
	</div>
	<div class="grid gap-2.5">
		<h1 class="flex flex-wrap gap-1.5 text-lg font-bold text-gray-800">
			{#if title.length > 35}
				<Tooltip text={title}>
					<span class="line-clamp-2 text-start text-ellipsis">
						{title}
					</span>
				</Tooltip>
			{:else}
				<span class="line-clamp-2 text-start text-ellipsis">
					{title}
				</span>
			{/if}

			<span
				class=" inline-flex w-fit items-center justify-center gap-1 rounded-lg border border-gray-200 bg-[#E0DED9]/30
				px-2 py-1 text-xs text-gray-900"
			>
				<Clock size="14" stroke-width="2.5" />
				{duration} mins</span
			>
		</h1>
		{#if description}
			<h2 class=" font-medium text-gray-500">
				<ScrollArea maxHeight="200px">
					{description}
				</ScrollArea>
			</h2>
		{/if}
	</div>
	<div class="flex grow flex-col justify-end">
		<div class="inline-flex items-center justify-start gap-2.5">
			<BriefcaseBusiness stroke-width="2" size={16} class="  text-gray-500" />
			{#if booking_store.booking_date.day > 0}
				<h1 class="font-bold">
					{booking_store.booking_date.week} :
					<span class="inline-flex font-medium text-gray-900"
						>{booking_store.booking_slot.slot_hour}:{booking_store.booking_slot.slot_mins} - time+15mins</span
					>
				</h1>
			{:else}
				<h1 class="font-bold">
					Monday - Friday : <span class="inline-flex font-medium text-gray-900">9:00 - 17:00</span>
				</h1>
			{/if}
		</div>
		<div class="inline-flex items-center justify-start gap-2.5">
			<MapPin stroke-width="2" size={16} class="  text-gray-500" />
			<h1 class="font-bold">
				India - <span class="inline-flex font-medium text-gray-900">Mumbai</span>
			</h1>
		</div>
		<!-- Thus user's available hours are 9-5 from india. -->
	</div>
</section>
