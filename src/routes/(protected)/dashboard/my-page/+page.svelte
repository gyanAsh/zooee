<script lang="ts">
	import { resolve } from '$app/paths';
	import Button from '$lib/client/components/ui/button.svelte';
	import EditBox from '$lib/client/components/ui/edit_box.svelte';
	import { AtSign, Clock3, ImagePlus, PencilSparkles, Plus } from '@lucide/svelte';
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	import EditNameDialog from './EditNameDialog.svelte';
	import EditUsernameDialog from './EditUsernameDialog.svelte';
	import EditBioDialog from './EditBioDialog.svelte';
	import AddProfileImage from './AddProfileImage.svelte';
	import AddHeroImage from './AddHeroImage.svelte';
	import NoBookingIDFound from './NoBookingIDFound.svelte';

	const links = [15, 20, 30];
	let { data, form } = $props();

	let alert = $state<{
		message: string;
	} | null>(null);

	$effect(() => {
		// Read `form` itself (not just form.message) so a new actionData
		// result always re-triggers this effect, even for identical text.
		const f = form;

		if (!f?.message) {
			alert = null;
			return;
		}

		alert = { message: f.message };

		const id = setTimeout(() => {
			alert = null;
		}, 3000);

		// Runs before the next effect run AND on unmount.
		return () => clearTimeout(id);
	});

	let allowEdit = $state(true);
</script>

<section
	class="scrollbar-custom relative flex h-full justify-center overflow-auto rounded-sm bg-[#E0DED9] p-4 select-none"
	in:fly={{ y: -10, duration: 130, easing: cubicOut }}
>
	{#if data.bookingPage?.display_name && data.bookingPage.username}
		<section
			class=" absolute top-0 flex h-fit w-fit items-center justify-center gap-2.5 rounded-b-2xl border-x border-b bg-gray-50 p-2"
		>
			<Button variant="secondary" onClick={() => (allowEdit = !allowEdit)}>
				<div class="inline-flex items-center justify-center gap-1 text-sm font-medium">
					<PencilSparkles size="14" strokeWidth="2" />
					<span>Edit Profile</span>
				</div>
			</Button>

			<div class="my-0.5 w-[1.5px] self-stretch rounded-full bg-gray-300"></div>
			<Button>
				<div class="inline-flex items-center justify-center gap-1 text-sm font-medium">
					<Plus class="" size="14" strokeWidth="2" />
					<span>Add Booking Link</span>
				</div>
			</Button>
		</section>
		<section
			class="mt-10 grid h-fit w-full max-w-3xl gap-2.5 rounded-4xl border bg-[#FCFBF7] p-4 text-sm"
		>
			{#if true}
				<AddHeroImage {form} {alert}>
					<section
						class="group relative grid aspect-10/4 w-full cursor-pointer
				 place-items-center gap-1 rounded-2xl border-2 border-dashed border-gray-400 bg-zinc-100
				 text-sm font-medium text-gray-400 hover:border-gray-500
				hover:text-gray-500 active:border-gray-800 active:text-gray-800 md:aspect-10/3"
					>
						<div class="flex flex-col items-center">
							<ImagePlus size="24" strokeWidth="1.5" />
							<h2>Banner</h2>
						</div>

						<div
							class="absolute -top-8 left-1/2 hidden w-fit -translate-x-1/2 rounded-lg border border-gray-500 bg-zinc-900
						px-1.5 py-1 text-center text-xs text-nowrap text-gray-50 transition-all duration-150 ease-in group-hover:flex"
						>
							Add Banner
						</div>
					</section>
				</AddHeroImage>
			{:else}
				<img
					src="https://d3p3fw3rutb1if.cloudfront.net/photos/c010380a-8595-45ad-8e1f-b17af6d93df2"
					alt="bg_image"
					class="aspect-10/4 w-full rounded-2xl object-cover md:aspect-10/3"
				/>
			{/if}

			<div class="relative">
				{#if true}
					<AddProfileImage {form} {alert}>
						<section
							class="group absolute right-0 flex aspect-square size-20 -translate-x-1/2 translate-y-[-80%] cursor-pointer flex-col items-center justify-center
					    gap-1 rounded-2xl border-2 border-dashed border-gray-400 bg-gray-100 object-cover text-sm font-medium text-gray-400 hover:border-gray-500 hover:text-gray-500 active:border-gray-800 active:text-gray-800 md:size-25"
						>
							<ImagePlus size="24" strokeWidth="1.5" />
							<h2>Profile</h2>
							<div
								class="absolute -top-8 left-1/2 hidden w-fit -translate-x-1/2 rounded-lg border border-gray-500 bg-zinc-900 px-1.5 py-1 text-center text-xs text-nowrap text-gray-50 transition-all duration-150 ease-in group-hover:flex"
							>
								Add Profile
							</div>
						</section>
					</AddProfileImage>
				{:else}
					<img
						src="https://framerusercontent.com/images/GPMWO2lffxJQOSExK7qFWyv6M.jpg?width=200"
						alt="temp_profile_img"
						class="absolute right-0 aspect-square size-20 -translate-x-1/2 translate-y-[-80%] rounded-2xl
					border-2 border-gray-50 bg-gray-50 object-cover md:size-25"
					/>
				{/if}
			</div>
			<section class="grid gap-5">
				<div>
					<div class="flex items-center gap-2.5">
						<EditNameDialog {form} {alert} defaultValue={data.bookingPage.display_name}>
							<EditBox top="-top-[calc(100%+4px)]" text="Update Display Name">
								<h1 class="text-lg font-bold">{data.bookingPage.display_name}</h1>
							</EditBox>
						</EditNameDialog>
						<EditUsernameDialog {form} {alert} defaultValue={data.bookingPage.username}>
							<EditBox top="-top-[calc(100%+12px)]" text="Update Username">
								<h2 class="  gap-.5 flex items-center text-gray-500">
									<AtSign size="14" strokeWidth="2" />
									<span> {data.bookingPage.username}</span>
								</h2>
							</EditBox>
						</EditUsernameDialog>
					</div>
					<EditBioDialog {form} {alert} defaultValue={data.bookingPage.bio || ''}>
						<EditBox top="-top-[calc(100%+12px)]" text="Update Bio">
							<p class="text-start">
								{data.bookingPage.bio}
							</p>
						</EditBox>
					</EditBioDialog>
				</div>

				{#if links.length > 0}
					<section class="grid w-full gap-2.5">
						{#each links as link (link)}
							<a
								href={resolve(`/dashboard/my-page/${link}`)}
								class="group flex w-full items-center justify-between rounded-2xl border
								border-gray-300 bg-[#E0DED9]/30 px-4 py-3 transition-all duration-75 ease-in hover:border-gray-500
								hover:bg-white active:-translate-y-1 active:scale-[0.99] active:border-gray-800"
							>
								<div class="grid">
									<h1 class=" font-medium">{link} mins meeting</h1>
									<p>Meeting description....</p>
								</div>
								<div class="grid h-full place-items-center">
									<div
										class="inline-flex w-fit items-center gap-0.5 font-medium
									  text-gray-800"
									>
										<Clock3 size="16" stroke-width="2.5" />
										<span>{link} m</span>
									</div>
								</div>
							</a>
						{/each}
					</section>
				{:else}
					<h1 class="my-4 text-sm text-gray-500 italic">---- No Appointment Links Created ----</h1>
					<button
						class="h-fit w-fit max-w-xl cursor-pointer rounded-lg bg-blue-500 px-2 py-1.5 text-sm font-bold text-white"
					>
						Create Booking Links
					</button>
				{/if}
			</section>
		</section>
	{:else}
		<NoBookingIDFound {form} />
	{/if}
</section>
