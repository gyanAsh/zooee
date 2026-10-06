<script>
	import { BriefcaseBusiness, Clock, MapPin } from '@lucide/svelte';
</script>

<section class="grid gap-10">
	<div class="grid gap-0.5">
		<img
			src="https://framerusercontent.com/images/GPMWO2lffxJQOSExK7qFWyv6M.jpg?width=200"
			alt="temp_profile_img"
			class="aspect-square size-15 rounded-full border-2 border-gray-50 object-cover md:size-20"
		/>
		<h1 class="text-lg font-bold text-gray-800">Gyan Ashish Ekka</h1>
		<h2 class="text-sm font-medium text-gray-500">Your Stratagic Patner in Growth.</h2>
	</div>
	<div class="grid gap-2.5">
		<h1 class="flex flex-wrap text-2xl leading-7.5 font-bold text-gray-800">
			Book Your Breakthrough Session
			<span
				class="inline-flex w-fit items-center justify-center gap-1 rounded-full border bg-gray-800 px-2 py-1 text-xs text-gray-100"
			>
				<Clock size="14" stroke-width="2.5" />
				15 mins</span
			>
		</h1>
		<h2 class="text-base font-medium text-gray-700">
			Need Brand Groth ? Get Expert advice, tailored stratagies and market smarter with confidence.
		</h2>
	</div>
	<div>
		<div class="inline-flex items-center justify-start gap-2.5 text-sm">
			<BriefcaseBusiness stroke-width="2" size={16} class="  text-gray-500" />
			<h1 class="font-bold">
				Monday - Friday : <span class="inline-flex font-medium text-gray-900">9:00 - 17:00</span>
			</h1>
		</div>
		<div class="inline-flex items-center justify-start gap-2.5 text-sm">
			<MapPin stroke-width="2" size={16} class="  text-gray-500" />
			<h1 class="font-bold">
				India - <span class="inline-flex font-medium text-gray-900">Mumbai</span>
			</h1>
		</div>
		<!-- Thus user's available hours are 9-5 from india. -->
	</div>
</section>
