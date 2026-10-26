<script lang="ts">
	import { Tooltip } from 'bits-ui';
	import ScrollArea from './scroll-area.svelte';
	const { children, text } = $props();
</script>

<!-- <Tooltip.Provider>
	<Tooltip.Root delayDuration={200}>
		<Tooltip.Trigger
			class="inline-flex size-10 items-center justify-center rounded-full
		border border-border-input bg-background-alt shadow-btn ring-dark ring-offset-background hover:bg-muted focus-visible:ring-2 focus-visible:ring-dark focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden"
		>
			{@render children()}
		</Tooltip.Trigger>
		<Tooltip.Content
			sideOffset={8}
			class="animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--bits-tooltip-content-transform-origin)"
		>
			<div
				class="z-0 flex items-center justify-center rounded-input border border-dark-10 bg-background p-3 text-sm font-medium shadow-popover outline-hidden"
			>
				{text}
			</div>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider> -->

<Tooltip.Provider>
	<Tooltip.Root delayDuration={200}>
		<Tooltip.Trigger>
			{@render children()}
		</Tooltip.Trigger>
		<Tooltip.Portal>
			<Tooltip.Content
				sideOffset={8}
				class="animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0
			 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2
			 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2
				max-w-100 origin-(--bits-tooltip-content-transform-origin)"
			>
				<div
					class="z-0 flex items-center justify-center rounded-2xl border border-zinc-800
					 bg-[#FCFBF7] p-3 text-sm font-medium text-zinc-800 shadow-popover outline-hidden"
				>
					<ScrollArea maxHeight="100px">
						{text}
					</ScrollArea>
				</div>

				<Tooltip.Arrow class="text-zinc-800 " />
			</Tooltip.Content>
		</Tooltip.Portal>
	</Tooltip.Root>
</Tooltip.Provider>
