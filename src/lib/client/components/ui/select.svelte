<script lang="ts">
	import { Select } from 'bits-ui';
	import { Check, ChevronDown, ChevronUp } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	interface SelectItem {
		value: string;
		label: string;
		disabled?: boolean;
	}

	type Props = {
		items: SelectItem[];
		value?: string;
		placeholder?: string;
		ariaLabel?: string;
		icon?: Snippet;
		triggerClass?: string;
		contentClass?: string;
		allowDeselect?: boolean;
	};

	let {
		items,
		value = $bindable(''),
		placeholder = 'Select an option',
		ariaLabel = placeholder,
		icon,
		triggerClass = 'inline-flex h-input w-74 touch-none items-center rounded-9px border border-border-input bg-background px-2.75 text-sm transition-colors select-none data-placeholder:text-foreground-alt/50',
		contentClass = '',
		allowDeselect = false
	}: Props = $props();
</script>

<Select.Root type="single" {items} bind:value {allowDeselect}>
	<Select.Trigger class={triggerClass} aria-label={ariaLabel}>
		{@render icon?.()}
		<Select.Value {placeholder} class="min-w-0 flex-1 truncate" />
		<ChevronDown class="ml-auto size-6 shrink-0 text-muted-foreground" />
	</Select.Trigger>
	<Select.Portal>
		<Select.Content
			class="focus-override data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 h-96 max-h-(--bits-select-content-available-height) w-max max-w-[min(90vw,24rem)] min-w-(--bits-select-anchor-width) rounded-xl border border-muted bg-background px-1 py-3 shadow-popover outline-hidden select-none data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1 {contentClass}"
			sideOffset={10}
		>
			<Select.ScrollUpButton class="flex w-full items-center justify-center">
				<ChevronUp class="size-3" />
			</Select.ScrollUpButton>
			<Select.Viewport class="p-1">
				{#each items as item, i (i + item.value)}
					<Select.Item
						class="flex h-10 w-full min-w-0 items-center rounded-button py-3 pr-1.5 pl-5 text-sm outline-hidden select-none data-disabled:opacity-50 data-highlighted:bg-muted"
						value={item.value}
						label={item.label}
						disabled={item.disabled}
					>
						{#snippet children({ selected })}
							<span class="truncate">{item.label}</span>
							{#if selected}
								<div class="ml-auto pl-2">
									<Check aria-label="check" />
								</div>
							{/if}
						{/snippet}
					</Select.Item>
				{/each}
			</Select.Viewport>
			<Select.ScrollDownButton class="flex w-full items-center justify-center">
				<ChevronDown class="size-3" />
			</Select.ScrollDownButton>
		</Select.Content>
	</Select.Portal>
</Select.Root>
