<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/client/components/ui/button.svelte';
	import { usernameSchema } from '$lib/validation-schemas/booking-page.js';
	import { X } from '@lucide/svelte';
	import { Dialog } from 'bits-ui';
	import type { Snippet } from 'svelte';
	const { children, defaultValue = '' }: { defaultValue?: string; children: Snippet } = $props();

	let submitting = $state(false);

	let username_value = $derived(defaultValue);

	let usernameError = $state<string | null>(null);

	function validateUsername(event: Event) {
		usernameError = '';
		const input = event.target as HTMLInputElement;
		const result = usernameSchema.safeParse(input.value);
		usernameError = result.success ? null : (result.error.issues[0]?.message ?? 'Invalid name');
	}

	let isSame = $derived(username_value === defaultValue);
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
			class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
			data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%]
              z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] rounded-2xl
              border bg-[#F5F5F5] p-5 shadow-popover outline-hidden sm:max-w-122.5 md:w-full"
		>
			<Dialog.Title
				class="flex w-full items-center justify-start text-lg font-semibold tracking-tight"
			>
				Edit Username Name
			</Dialog.Title>
			<Dialog.Description class="text-sm text-foreground-alt">
				This forms your personal booking link <span
					class="bg-[#E0DED9] px-2 font-medium text-gray-900">https://zooee.com/{defaultValue}</span
				> and identifies your account
			</Dialog.Description>
			<form method="POST" action="?/update_username" use:enhance>
				<div class="flex flex-col items-start py-5">
					<div class="relative w-full">
						<input
							id="username_id"
							class="w-full rounded-lg border-2 px-2.5 py-1.5 font-bold
							{usernameError ? 'border-red-400' : 'border-gray-600 '}
    						{submitting ? 'opacity-70' : ''}
    						text-sm transition-colors focus:border-blue-500 focus:ring-1
    						focus:ring-transparent focus:outline-none"
							placeholder="Your username"
							bind:value={username_value}
							oninput={validateUsername}
							disabled={submitting}
							name="username"
						/>
						{#if !!usernameError}
							<p
								class="absolute -bottom-2.5 left-0 translate-y-full text-xs font-medium text-red-500"
							>
								* {usernameError}
							</p>
						{/if}
					</div>
				</div>
				<div class="flex w-full justify-end">
					{#if !!usernameError || isSame}
						<Dialog.Close>
							<Button variant="ghost">Close</Button>
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
