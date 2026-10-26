<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/client/components/ui/button.svelte';
	import { displayNameSchema } from '$lib/validation-schemas/booking-page.js';
	import { CircleAlert, CircleCheck, X } from '@lucide/svelte';
	import { Dialog } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import type { ActionData } from './$types.js';
	import { fly } from 'svelte/transition';
	import { cubicIn, cubicOut } from 'svelte/easing';

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
	let name_value = $derived(defaultValue);

	let nameError = $state<string | null>(null);

	function validateName(event: Event) {
		nameError = '';
		const input = event.target as HTMLInputElement;
		const result = displayNameSchema.safeParse(input.value);
		nameError = result.success ? null : (result.error.issues[0]?.message ?? 'Invalid name');
	}
	let isSame = $derived(name_value === defaultValue);
</script>

<Dialog.Root>
	<Dialog.Trigger>
		{@render children()}
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
				Edit Display Name
			</Dialog.Title>
			<Dialog.Description class="text-sm text-foreground-alt">
				Choose how your name appears on your profile and public activity.
			</Dialog.Description>
			<form method="POST" action="?/update_display_name" use:enhance>
				<div class=" flex flex-col items-start py-5">
					<div class="relative w-full">
						<input
							id="display_name_id"
							class="w-full rounded-lg border-2 px-2.5 py-1.5 font-bold
							{nameError ? 'border-red-400' : 'border-gray-600 '}
    						{submitting ? 'opacity-70' : ''}
    						text-sm transition-colors focus:border-blue-500 focus:ring-1
    						focus:ring-transparent focus:outline-none"
							placeholder="Your name"
							bind:value={name_value}
							oninput={validateName}
							disabled={submitting}
							required
							name="name"
						/>
						<div class="absolute -bottom-2.5 left-0 translate-y-full text-xs font-medium">
							{#if form && alert && form.type === 'name'}
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
				</div>

				<div class="flex w-full justify-end">
					{#if !!nameError || isSame}
						<Dialog.Close type="button">
							<Button type="button" variant="ghost">Close</Button>
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
