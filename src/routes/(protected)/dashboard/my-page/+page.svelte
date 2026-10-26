<script lang="ts">
	import { resolve } from '$app/paths';
	import Button from '$lib/client/components/ui/button.svelte';
	import EditBox from '$lib/client/components/ui/edit_box.svelte';
	import {
		AtSign,
		Clock3,
		ImagePlus,
		PencilSparkles,
		Plus,
		SquarePen,
		Trash
	} from '@lucide/svelte';
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	import EditNameDialog from './EditNameDialog.svelte';
	import EditUsernameDialog from './EditUsernameDialog.svelte';
	import EditBioDialog from './EditBioDialog.svelte';
	import AddProfileImage from './AddProfileImage.svelte';
	import NoBookingIDFound from './NoBookingIDFound.svelte';
	import AddBannerImage from './AddBannerImage.svelte';
	import AddBookingLinks from './AddBookingLinks.svelte';
	import { enhance } from '$app/forms';

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

	let allowEdit = $state(false);
	let bannerUrl =
		'https://d3p3fw3rutb1if.cloudfront.net/photos/c010380a-8595-45ad-8e1f-b17af6d93df2';
	let profileURL = 'https://framerusercontent.com/images/GPMWO2lffxJQOSExK7qFWyv6M.jpg?width=200';
</script>

<section
	class="scrollbar-custom relative flex h-full justify-center overflow-auto rounded-sm bg-[#E0DED9] p-4 select-none"
	in:fly={{ y: -10, duration: 130, easing: cubicOut }}
>
	{#if data.bookingPage?.display_name && data.bookingPage.username}
		<section
			class=" absolute top-0 flex h-fit w-fit items-center justify-center gap-2.5 rounded-b-2xl border-x border-b bg-gray-50 p-2"
		>
			<Button variant="secondary" onclick={() => (allowEdit = !allowEdit)}>
				<div class="inline-flex items-center justify-center gap-1 text-sm font-medium">
					{#if !allowEdit}
						<PencilSparkles size="14" strokeWidth="2" />
						<span>Edit Profile</span>
					{:else}
						<span>Save Profile</span>
					{/if}
				</div>
			</Button>

			<div class="my-0.5 w-[1.5px] self-stretch rounded-full bg-gray-300"></div>
			<AddBookingLinks username={data.bookingPage.username} {form} {alert}>
				<div class="inline-flex items-center justify-center gap-1 text-sm font-medium">
					<Plus class="" size="14" strokeWidth="2" />
					<span>Add Booking Link</span>
				</div>
			</AddBookingLinks>
		</section>
		<section
			class="mt-10 grid h-fit w-full max-w-3xl gap-2.5 rounded-4xl border bg-[#FCFBF7] p-4 text-sm"
		>
			{#if allowEdit}
				<AddBannerImage {form} {alert}>
					<section
						class="group relative grid aspect-10/4 w-full cursor-pointer
					    place-items-center gap-1 rounded-2xl border border-dashed border-blue-400 bg-zinc-100
				        text-sm font-medium text-gray-400 hover:border-blue-500
					    hover:text-gray-500 active:border-blue-800 active:text-gray-800 md:aspect-10/3"
					>
						{#if bannerUrl}
							<img
								src={bannerUrl}
								alt="Banner"
								class="absolute inset-0 h-full w-full rounded-2xl object-cover p-1"
							/>
						{/if}
						<div class="flex flex-col items-center">
							<ImagePlus size="24" strokeWidth="1.5" />
							<h2>Banner</h2>
						</div>

						<div
							class="absolute -top-8 left-1/2 hidden w-fit -translate-x-1/2 rounded-lg border border-gray-500 bg-zinc-900
						px-1.5 py-1 text-center text-xs text-nowrap text-gray-50 transition-all duration-150 ease-in group-hover:flex"
						>
							{bannerUrl ? 'Change Banner' : 'Add Banner'}
						</div>
					</section>
				</AddBannerImage>
			{:else if bannerUrl}
				<img
					src={bannerUrl}
					alt="bg_image"
					class="aspect-10/4 w-full rounded-2xl object-cover md:aspect-10/3"
				/>
			{/if}

			<div class="relative h-5">
				{#if allowEdit}
					<AddProfileImage {form} {alert}>
						<section
							class="group active:blue-gray-800 absolute right-0 flex aspect-square size-20 -translate-x-1/2 translate-y-[-80%] cursor-pointer flex-col items-center
					        justify-center gap-1 rounded-2xl border border-dashed border-blue-400 bg-gray-100 object-cover text-sm
							font-medium text-gray-400 hover:border-blue-500 hover:text-gray-500 active:text-gray-800 md:size-25"
						>
							{#if profileURL}
								<img
									src={profileURL}
									alt="Profile"
									class="absolute inset-0 h-full w-full rounded-2xl object-cover p-1"
								/>
							{/if}
							<ImagePlus size="24" strokeWidth="1.5" />
							<h2>Profile</h2>
							<div
								class="absolute -top-8 left-1/2 hidden w-fit -translate-x-1/2 rounded-lg border border-gray-500 bg-zinc-900 px-1.5 py-1
							    text-center text-xs text-nowrap text-gray-50 transition-all duration-150 ease-in group-hover:flex"
							>
								{profileURL ? 'Change Profile' : 'Add Profile'}
							</div>
						</section>
					</AddProfileImage>
				{:else if profileURL}
					<img
						src={profileURL}
						alt="temp_profile_img"
						class="aspect-square size-20 rounded-2xl
						{bannerUrl ? 'absolute right-0 -translate-x-1/2 translate-y-[-62%]' : ''}
						border-2 border-gray-50 bg-gray-50 object-cover md:size-25"
					/>
				{/if}
			</div>
			<section class="grid gap-5">
				<div class="grid gap-1.5">
					<div class="flex items-center gap-2.5">
						{#if allowEdit}
							<EditNameDialog {form} {alert} defaultValue={data.bookingPage.display_name}>
								<EditBox top="-top-[calc(100%+4px)]" text="Update Display Name">
									<h1 class="text-lg font-bold">{data.bookingPage.display_name}</h1>
								</EditBox>
							</EditNameDialog>
						{:else}
							<h1 class="text-lg font-bold">{data.bookingPage.display_name}</h1>
						{/if}
						{#if allowEdit}
							<EditUsernameDialog {form} {alert} defaultValue={data.bookingPage.username}>
								<EditBox top="-top-[calc(100%+12px)]" text="Update Username">
									<h2 class="flex items-center text-center text-gray-500">
										<AtSign size="14" strokeWidth="2" />
										<span> {data.bookingPage.username}</span>
									</h2>
								</EditBox>
							</EditUsernameDialog>
						{:else}
							<h2 class="flex items-center text-center text-gray-500">
								<AtSign size="14" strokeWidth="2" />
								<span> {data.bookingPage.username}</span>
							</h2>
						{/if}
					</div>
					{#if allowEdit}
						<EditBioDialog {form} {alert} defaultValue={data.bookingPage.bio || ''}>
							<EditBox top="-top-[calc(100%+12px)]" text="Update Bio">
								<p class="text-start {data.bookingPage.bio ? '' : 'italic'}">
									{data.bookingPage.bio
										? data.bookingPage.bio
										: 'Add you bio to help people identify you.'}
								</p>
							</EditBox>
						</EditBioDialog>
					{:else}
						<p class="text-start">{data.bookingPage.bio}</p>
					{/if}
				</div>

				{#if data.bookingLinks.length > 0}
					<section class="grid w-full gap-2.5">
						{#each data.bookingLinks as link (link)}
							<a
								href={allowEdit
									? null
									: resolve(`/dashboard/my-page/${data.bookingPage.username}/${link.url}`)}
								class="group flex min-h-17 w-full items-center justify-between rounded-2xl border
    								{allowEdit
									? 'border-dashed border-blue-300	hover:border-blue-500'
									: 'active:-translate-y-1 active:scale-[0.99] active:border-gray-800'}
								    bg-[#E0DED9]/30 px-4 py-3 transition-all duration-75 ease-in
									hover:bg-white"
							>
								<div class="grid">
									<h1 class=" truncate font-medium">{link.name}</h1>
									<p class="line-clamp-2 text-ellipsis">
										{link.description}
									</p>
								</div>
								<div
									class="grid h-full min-w-fit place-items-center
								{allowEdit ? 'grid-cols-3' : 'grid-cols-1'}"
								>
									<div
										class="flex items-center gap-0.5 rounded-lg bg-[#E0DED9]/80 px-1 py-0.5 font-medium
									  text-gray-800 group-hover:bg-[#E0DED9]/30"
									>
										<Clock3 size="14" stroke-width="2.5" />
										<span>{link.duration_minutes} m</span>
									</div>
									{#if allowEdit}
										<AddBookingLinks
											bookingLink={{
												id: link.id,
												url: link.url,
												name: link.name,
												description: link.description,
												duration_minutes: link.duration_minutes
											}}
											username={data.bookingPage.username}
											{form}
											{alert}
										>
											<div class="flex items-center gap-1">
												<SquarePen size="14" strokeWidth="2" />
												<h2 class="text-sm">Edit</h2>
											</div>
										</AddBookingLinks>
										<form method="POST" action="?/delete_booking_link" use:enhance>
											<input type="hidden" name="id" value={link.id} />
											<Button type="submit" variant="danger" aria-label="Delete {link.name}">
												<div class="flex items-center gap-1">
													<Trash size="14" strokeWidth="2" />
													<h2 class="text-sm">Delete</h2>
												</div>
											</Button>
										</form>
									{/if}
								</div>
							</a>
						{/each}
					</section>
				{:else}
					<section class="grid place-items-center gap-1.5">
						<h1 class="my-4 text-sm text-gray-500 italic">
							---- No Appointment Links Created ----
						</h1>
						<AddBookingLinks username={data.bookingPage.username} {form} {alert}
							>Create Booking Links</AddBookingLinks
						>
					</section>
				{/if}
			</section>
		</section>
	{:else}
		<NoBookingIDFound {form} />
	{/if}
</section>
