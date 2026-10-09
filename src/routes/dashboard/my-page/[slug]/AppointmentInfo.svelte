<script>
	import { BriefcaseBusiness, Clock, MapPin } from '@lucide/svelte';
</script>

<section class="flex h-full flex-col gap-5 text-sm">
	<div class="grid gap-0.5">
		<img
			src="https://framerusercontent.com/images/GPMWO2lffxJQOSExK7qFWyv6M.jpg?width=200"
			alt="temp_profile_img"
			class="aspect-square size-15 rounded-full border-2 border-gray-50 object-cover md:size-20"
		/>
		<h1 class="font-bold text-gray-800">Gyan Ashish Ekka</h1>
		<h2 class="font-medium text-gray-500">Your Stratagic Patner in Growth.</h2>
	</div>
	<div class="grid gap-2.5">
		<h1 class="flex flex-wrap text-lg font-bold text-gray-800">
			Book Your Breakthrough Session
			<span
				class="py-.5 inline-flex w-fit items-center justify-center gap-1 rounded-lg border border-gray-200 bg-gray-100 px-1 text-xxs leading-6 text-gray-900"
			>
				<Clock size="14" stroke-width="2.5" />
				15 mins</span
			>
		</h1>
		<h2 class=" text-sm font-medium text-gray-500">
			Need Brand Groth ? Get Expert advice, tailored stratagies and market smarter with confidence.
		</h2>
	</div>
	<div class="flex grow flex-col justify-end">
		<div class="inline-flex items-center justify-start gap-2.5">
			<BriefcaseBusiness stroke-width="2" size={16} class="  text-gray-500" />
			<h1 class="font-bold">
				Monday - Friday : <span class="inline-flex font-medium text-gray-900">9:00 - 17:00</span>
			</h1>
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
