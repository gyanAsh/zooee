<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowRight, Clock3, PencilSparkles, Plus, Settings } from '@lucide/svelte';
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	const links = [15, 20, 30];
</script>

<section
	style="background: radial-gradient(125% 125% at 50% 10%, #000 40%, #6366f1 100%);"
	class="scrollbar-custom relative flex h-full justify-center overflow-auto rounded-sm p-4"
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
	<section class="mt-10 h-fit w-full max-w-xl rounded-4xl border bg-gray-50 p-4">
		<img
			src="https://d3p3fw3rutb1if.cloudfront.net/photos/c010380a-8595-45ad-8e1f-b17af6d93df2"
			alt="bg_image"
			class="aspect-10/5 w-full rounded-2xl object-cover md:aspect-10/3"
		/>
		<div class="relative h-12 md:h-15">
			<img
				src="https://framerusercontent.com/images/GPMWO2lffxJQOSExK7qFWyv6M.jpg?width=200"
				alt="temp_profile_img"
				class="absolute aspect-square size-20 translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gray-50 object-cover
				md:size-25"
			/>
			<div class="flex h-full items-center justify-end">
				<button
					class="inline-flex cursor-pointer items-center justify-center gap-1 rounded-lg bg-blue-500 px-2 py-1.5 text-xs font-medium text-gray-50"
				>
					<PencilSparkles size="12" strokeWidth="2" />
					<span>Edit Profile</span>
				</button>
			</div>
		</div>
		<section class="grid gap-3">
			<div>
				<h1 class="font-medium">Gyan Ashish Ekka</h1>
				<h2 class="text-sm text-gray-500">@ekkoish</h2>

				<p class="my-2 text-sm">
					We make shopping grocerries online fun! Best part is you get to learn what you are eating.
				</p>
			</div>
			<div class="  flex flex-col items-center justify-center gap-2.5">
				{#if links.length > 0}
					<section class="grid w-full gap-2.5">
						{#each links as link (link)}
							<a
								href={resolve(`/dashboard/my-page/${link}`)}
								class="group flex w-full items-center justify-between rounded-2xl border border-gray-300 bg-white px-4 py-3.5 text-sm transition-all duration-75 hover:bg-gray-100"
							>
								<div class="grid gap-1">
									<h1 class="font-bold">{link} mins meeting</h1>
									<p class="text-xs">Meeting description....</p>
									<div class="text-xxs font-bold">
										<span
											class="inline-flex w-fit items-center justify-center gap-0.5 rounded-full
											border border-gray-300 bg-gray-50 px-1.5 py-1 text-gray-900"
										>
											<Clock3 size="10" stroke-width="3" />
											15 m</span
										>
									</div>
								</div>
								<div class="h-full">
									<button
										class="inline-flex cursor-pointer items-center justify-between gap-1 rounded-full bg-gray-700 px-4 py-1.5 text-xs font-medium text-gray-50
									    hover:scale-105 active:scale-95"
									>
										<span>Book</span>
										<ArrowRight class="size-0 group-hover:size-full" size="14" strokeWidth="3" />
									</button>
								</div>
							</a>
						{/each}
					</section>
				{:else}
					<h1 class="my-4 text-xs text-gray-500 italic">---- No Appointment Links Created ----</h1>
					<button
						class="h-fit w-fit max-w-xl cursor-pointer rounded-lg bg-blue-500 px-2 py-1.5 text-sm font-bold text-white"
					>
						Create Booking Links
					</button>
				{/if}
			</div>
		</section>
	</section>
</section>
