<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/client/components/ui/button.svelte';
	import {
		bookingLinkDescriptionSchema,
		bookingLinkNameSchema
	} from '$lib/validation-schemas/booking-links.js';
	import { CircleAlert, CircleCheck, Minus, Plus, X } from '@lucide/svelte';
	import { Dialog } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import type { ActionData } from './$types.js';
	import { fly } from 'svelte/transition';
	import { cubicIn, cubicOut } from 'svelte/easing';

	type BookingLink = {
		id: string;
		name: string;
		description: string | null;
		duration_minutes: number;
	};

	const DURATION_MIN = 5;
	const DURATION_MAX = 480;
	const DURATION_STEP = 5;
	const DURATION_DEFAULT = 15;

	const {
		children,
		bookingLink = null,
		form,
		alert
	}: {
		children: Snippet;
		bookingLink?: BookingLink | null;
		form: ActionData;
		alert: {
			message: string;
		} | null;
	} = $props();

	const isEdit = $derived(bookingLink !== null);

	let open = $state(false);
	let submitting = $state(false);

	let name_value = $state('');
	let desc_value = $state('');
	let duration_value = $state<number>(DURATION_DEFAULT);

	// Reset the form whenever the dialog opens, so a previous create/edit
	// doesn't leak into the next one.
	$effect(() => {
		if (!open) return;
		name_value = bookingLink?.name ?? '';
		desc_value = bookingLink?.description ?? '';
		duration_value = bookingLink?.duration_minutes ?? DURATION_DEFAULT;
	});

	let nameError = $state<string | null>(null);
	let descriptionError = $state<string | null>(null);

	function validateBookingName(event: Event) {
		nameError = null;
		const input = event.target as HTMLInputElement;
		const result = bookingLinkNameSchema.safeParse(input.value);
		nameError = result.success ? null : (result.error.issues[0]?.message ?? 'Invalid name');
	}

	function validateBookingDescription(event: Event) {
		descriptionError = null;
		const input = event.target as HTMLInputElement;
		const result = bookingLinkDescriptionSchema.safeParse(input.value);
		descriptionError = result.success
			? null
			: (result.error.issues[0]?.message ?? 'Invalid description');
	}

	function clampDuration(value: number) {
		if (!Number.isFinite(value)) return DURATION_DEFAULT;
		const rounded = Math.round(value / DURATION_STEP) * DURATION_STEP;
		return Math.min(DURATION_MAX, Math.max(DURATION_MIN, rounded));
	}

	function changeDuration(delta: number) {
		duration_value = clampDuration(duration_value + delta);
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Button {...props}>
				{@render children()}
			</Button>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay
			class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0
			data-[state=open]:fade-in-0 fixed inset-0
            z-50 bg-black/80"
		/>
		<Dialog.Content
			class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0
			data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed
              top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] rounded-2xl
              border bg-[#F5F5F5] p-5 shadow-popover outline-hidden sm:max-w-122.5 md:w-full"
		>
			<Dialog.Title
				class="flex w-full items-center justify-start text-lg font-semibold tracking-tight"
			>
				{isEdit ? 'Edit Booking Link' : 'Create Booking Link'}
			</Dialog.Title>
			<Dialog.Description class="text-sm text-foreground-alt">
				{isEdit
					? 'Update the name, description or duration of this link.'
					: 'Add a new meeting type people can book from your page.'}
			</Dialog.Description>
			<form
				method="POST"
				action={isEdit ? '?/update_booking_link' : '?/create_booking_link'}
				use:enhance={() => {
					submitting = true;
					return async ({ result, update }) => {
						try {
							await update();
							if (result.type === 'success') open = false;
						} finally {
							submitting = false;
						}
					};
				}}
			>
				{#if bookingLink}
					<input type="hidden" name="id" value={bookingLink.id} />
				{/if}

				<div class="flex flex-col items-start gap-6 py-5">
					<div class="relative grid w-full gap-1.5">
						<label for="booking_link_name" class="text-sm font-bold text-gray-800"
							>Title <span class="font-normal text-red-500">*</span></label
						>
						<input
							id="booking_link_name"
							class="w-full rounded-lg border-2 px-2.5 py-1.5 font-medium
							{nameError ? 'border-red-400' : 'border-gray-600 '}
    						{submitting ? 'opacity-70' : ''}
    						text-sm transition-colors focus:border-blue-500 focus:ring-1
    						focus:ring-transparent focus:outline-none"
							placeholder="e.g. Intro call"
							bind:value={name_value}
							oninput={validateBookingName}
							disabled={submitting}
							maxlength={100}
							required
							name="name"
							aria-label="Booking link name"
						/>
						<div class="absolute -bottom-2.5 left-0 translate-y-full text-xs font-medium">
							{#if form && alert && (form.type === 'booking_link_name' || form.type === 'booking_link')}
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
							{:else if !!nameError}
								<span
									in:fly={{ y: -10, duration: 180, easing: cubicIn }}
									out:fly={{ y: -10, duration: 180, easing: cubicOut }}
									class="text-red-500"
								>
									* {nameError}
								</span>
							{/if}
						</div>
					</div>

					<div class="relative grid w-full gap-1.5">
						<label for="booking_link_description" class="text-sm font-bold text-gray-800">
							Description
						</label>
						<textarea
							id="booking_link_description"
							class="max-h-25 min-h-20 w-full rounded-lg border-2 px-2.5 py-1.5 font-medium
							{descriptionError ? 'border-red-400' : 'border-gray-600 '}
    						{submitting ? 'opacity-70' : ''}
    						text-sm transition-colors focus:border-blue-500 focus:ring-1
    						focus:ring-transparent focus:outline-none"
							placeholder="What is this link about?"
							bind:value={desc_value}
							oninput={validateBookingDescription}
							disabled={submitting}
							maxlength={500}
							name="description"
							aria-label="Booking link description"></textarea>
						<div class="absolute -bottom-2.5 left-0 translate-y-full text-xs font-medium">
							{#if form && alert && form.type === 'booking_link_description'}
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
							{:else if !!descriptionError}
								<span
									in:fly={{ y: -10, duration: 180, easing: cubicIn }}
									out:fly={{ y: -10, duration: 180, easing: cubicOut }}
									class="text-red-500"
								>
									* {descriptionError}
								</span>
							{/if}
						</div>
					</div>

					<div class="grid w-full gap-1.5">
						<div class="flex items-center justify-between">
							<label for="booking_link_duration" class="text-sm font-bold text-gray-800">
								Duration <span class="font-normal text-red-500">*</span>
							</label>
							<span class="text-xs text-gray-500">5-minute steps</span>
						</div>
						<div class="flex items-center gap-2">
							<Button
								type="button"
								variant="secondary"
								onclick={() => changeDuration(-DURATION_STEP)}
								disabled={submitting || duration_value <= DURATION_MIN}
								aria-label="Decrease duration by 5 minutes"
							>
								<Minus size="16" strokeWidth="2.5" />
							</Button>

							<input
								id="booking_link_duration"
								type="number"
								name="duration_minutes"
								min={DURATION_MIN}
								max={DURATION_MAX}
								step={DURATION_STEP}
								bind:value={duration_value}
								onblur={() => (duration_value = clampDuration(duration_value))}
								disabled={submitting}
								required
								class="w-20 rounded-lg border-2 border-gray-600 px-2.5 py-1.5 text-center text-sm
								font-bold transition-colors focus:border-blue-500 focus:ring-1
								focus:ring-transparent focus:outline-none disabled:opacity-70"
								aria-label="Booking duration in minutes"
							/>

							<Button
								type="button"
								variant="secondary"
								onclick={() => changeDuration(DURATION_STEP)}
								disabled={submitting || duration_value >= DURATION_MAX}
								aria-label="Increase duration by 5 minutes"
							>
								<Plus size="16" strokeWidth="2.5" />
							</Button>

							<span class="text-sm text-gray-500">minutes</span>
						</div>
						<div class="mt-0.5 min-h-4 text-xs font-medium">
							{#if form && alert && form.type === 'booking_link_duration'}
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
							{/if}
						</div>
					</div>
				</div>

				<div class="flex w-full justify-end">
					{#if !!nameError || !!descriptionError}
						<Dialog.Close type="button">
							<Button type="button" variant="ghost">Close</Button>
						</Dialog.Close>
					{:else}
						<Button type="submit" variant="primary" disabled={submitting}>
							{submitting ? 'Saving…' : isEdit ? 'Update' : 'Create'}
						</Button>
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
