<script>
	import Button from '$lib/client/components/ui/button.svelte';
	import { X } from '@lucide/svelte';
	import { Dialog } from 'bits-ui';
	const { children } = $props();
	let submitting = $state();
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
				Edit bio
			</Dialog.Title>
			<Dialog.Description class="text-sm text-foreground-alt">
				Add a brief description about yourself to help people know who they are booking with.
			</Dialog.Description>
			<div class="flex flex-col items-start py-5">
				<div class="relative w-full">
					<textarea
						id="bio_id"
						class="max-h-42 min-h-28 w-full rounded-lg border-2 border-gray-600 px-2.5 py-1.5 font-medium
						{submitting ? 'opacity-70' : ''}
						text-sm transition-colors focus:border-blue-500 focus:ring-1
						focus:ring-transparent focus:outline-none"
						placeholder="Your bio"
						name="bio"></textarea>
				</div>
			</div>
			<div class="flex w-full justify-end">
				<Dialog.Close>
					<Button variant="black">Save</Button>
				</Dialog.Close>
			</div>
			<Dialog.Close
				class="absolute top-5 right-5 cursor-pointer rounded-md focus-visible:ring-2
				focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background
				focus-visible:outline-hidden active:scale-[0.98]"
			>
				<div>
					<X class="size-5 text-foreground" />
					<span class="sr-only">Close</span>
				</div>
			</Dialog.Close>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
