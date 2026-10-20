<script lang="ts">
	import { Tooltip } from 'bits-ui';
	const { children, text, isActive = false, onClick = () => {} } = $props();
</script>

<Tooltip.Provider>
	<Tooltip.Root delayDuration={200}>
		<Tooltip.Trigger
			onclick={() => onClick()}
			class="cursor-[url('/svg/edit_pen.svg')_12_12,pointer] rounded-lg border border-dashed border-transparent
			transition-colors hover:border-gray-300 hover:bg-gray-100 hover:text-[#111828] active:border-gray-500 active:bg-[#e5e7eb]
			{isActive ? '' : ''}"
		>
			{@render children()}
		</Tooltip.Trigger>
		<Tooltip.Content
			sideOffset={8}
			class="animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0
			data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2
		    data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--bits-tooltip-content-transform-origin)"
		>
			<div
				class="z-0 flex items-center justify-center rounded-lg
			 border border-gray-500 bg-gray-900 px-2 py-1 text-xs font-medium text-gray-50 shadow-popover outline-hidden"
			>
				{text}
			</div>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
