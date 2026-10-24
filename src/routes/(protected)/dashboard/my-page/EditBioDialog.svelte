<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/client/components/ui/button.svelte';
	import { bioSchema } from '$lib/validation-schemas/booking-page.js';
	import { CircleAlert, CircleCheck, X } from '@lucide/svelte';
	import { Dialog } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import { cubicIn, cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import type { ActionData } from './$types.js';

	const {
		children,
		defaultValue = '',
		form,
		alert
	}: {
		defaultValue?: string;
		children: Snippet;
		form: ActionData;
		alert: {
			message: string;
		} | null;
	} = $props();

	let submitting = $state(false);
	let bio_value = $derived(defaultValue);

	let bioError = $state<string | null>(null);

	function validateBio(event: Event) {
		bioError = '';
		const input = event.target as HTMLInputElement;
		const result = bioSchema.safeParse(input.value);
		bioError = result.success ? null : (result.error.issues[0]?.message ?? 'Invalid name');
	}
	let isSame = $derived(bio_value === defaultValue);
</script>

<Dialog.Root>
	<Dialog.Trigger>
		{@render children()}
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay
			class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0
			data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80"
		/>
		<Dialog.Content
			class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
			data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%]
              z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] rounded-2xl
              border bg-[#F5F5F5] p-5 shadow-popover outline-hidden sm:max-w-122.5 md:w-full"
		>
			<Dialog.Title
				class="flex w-full items-center justify-start text-lg font-semibold tracking-tight"
			>
				Edit Bio
			</Dialog.Title>
			<Dialog.Description class="relative mb-3 text-sm text-foreground-alt">
				Add a brief description about yourself to help people know who they are booking with.
			</Dialog.Description>
			<form method="POST" action="?/update_bio" use:enhance>
				<div class="flex flex-col items-start py-5">
					<div class="relative w-full">
						<textarea
							id="bio_id"
							class="max-h-42 min-h-28 w-full rounded-lg border-2 border-gray-600 px-2.5 py-1.5 font-medium
    						{submitting ? 'opacity-70' : ''}
    						text-sm transition-colors focus:border-blue-500 focus:ring-1
    						focus:ring-transparent focus:outline-none"
							placeholder="Your bio"
							bind:value={bio_value}
							oninput={validateBio}
							disabled={submitting}
							name="bio"></textarea>
						<div class="absolute -bottom-2.5 left-0 translate-y-full text-xs font-medium">
							{#if form && alert && form.type === 'bio'}
								<span
									in:fly={{ y: -10, duration: 180, easing: cubicIn }}
									out:fly={{ y: -10, duration: 180, easing: cubicOut }}
									class="flex items-center gap-1 {form.success ? 'text-green-600' : 'text-red-500'}"
								>
									{#if form.success}
										<CircleCheck size="16" strokeWidth="2" class="shrink-0" />
									{:else}
										<CircleAlert size="16" strokeWidth="2" class="shrink-0" />
									{/if}
									<span>{alert.message}</span>
								</span>
							{:else if !!bioError}
								<span
									in:fly={{ y: -10, duration: 180, easing: cubicIn }}
									out:fly={{ y: -10, duration: 180, easing: cubicOut }}
									class="text-red-500"
								>
									* {bioError}
								</span>
							{/if}
						</div>
					</div>
				</div>
				<div class="flex w-full justify-end">
					{#if !!bioError || isSame}
						<Dialog.Close type="button">
							<Button variant="ghost" type="button">Close</Button>
						</Dialog.Close>
					{:else}
						<Button type="submit" variant="primary">Update</Button>
					{/if}
				</div>
			</form>
			<Dialog.Close
				class="absolute top-5 right-5 cursor-pointer rounded-md   hover:bg-gray-200
				focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2
				focus-visible:ring-offset-background focus-visible:outline-hidden active:scale-[0.98]"
			>
				<div>
					<X class="size-5 text-foreground" />
					<span class="sr-only">Close</span>
				</div>
			</Dialog.Close>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
