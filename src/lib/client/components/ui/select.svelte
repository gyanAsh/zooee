<script lang="ts">
	import { Select } from 'bits-ui';
	import { Check, ChevronDown, ChevronUp, Search } from '@lucide/svelte';
	import { tick, type Snippet } from 'svelte';

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
		searchable?: boolean;
		searchPlaceholder?: string;
	};

	let {
		items,
		value = $bindable(''),
		placeholder = 'Select an option',
		ariaLabel = placeholder,
		icon,
		triggerClass = 'inline-flex h-input w-74 touch-none items-center rounded-9px border border-border-input bg-background px-2.75 text-sm transition-colors select-none data-placeholder:text-foreground-alt/50',
		contentClass = '',
		allowDeselect = false,
		searchable = true,
		searchPlaceholder = 'Search...'
	}: Props = $props();

	let open = $state(false);
	let search = $state('');
	let triggerEl = $state<HTMLButtonElement | null>(null);
	let contentEl = $state<HTMLDivElement | null>(null);
	let searchInput = $state<HTMLInputElement | null>(null);

	const normalizedSearch = $derived(search.trim().toLowerCase());
	const filteredItems = $derived(
		!searchable || normalizedSearch === ''
			? items
			: items.filter((item) => item.label.toLowerCase().includes(normalizedSearch))
	);

	let wasOpen = false;

	// Focus the search field when the menu opens (the input mounts a moment after
	// `open` flips, so wait for its ref), reset it when it closes, and restore
	// focus to the trigger if closing left focus on the document body.
	$effect(() => {
		if (open) {
			wasOpen = true;
			if (!searchable || !searchInput) return;

			// The trigger's click handler focuses the trigger itself, so defer the
			// focus to after that runs to keep focus in the search field.
			const frame = requestAnimationFrame(() => {
				if (open && searchInput) searchInput.focus();
			});
			return () => cancelAnimationFrame(frame);
		}

		if (!wasOpen) return;
		wasOpen = false;
		search = '';
		tick().then(() => {
			if (document.activeElement === document.body) triggerEl?.focus();
		});
	});

	// Move the highlight to the first match whenever the filter changes so
	// keyboard selection (Enter) always targets a visible item.
	$effect(() => {
		const query = normalizedSearch;
		if (!open || query === '') return;

		tick().then(() => {
			if (!open || normalizedSearch !== query) return;
			// `Home` deterministically highlights the first candidate, whereas
			// `ArrowDown` would move relative to the previously highlighted item.
			forwardKey('Home');
		});
	});

	const navigationKeys = new Set(['ArrowDown', 'ArrowUp', 'Home', 'End', 'PageUp', 'PageDown']);

	// The trigger owns keyboard navigation and highlighting, so forward navigation
	// keys pressed in the search field to it without moving focus.
	function forwardKey(key: string) {
		triggerEl?.dispatchEvent(
			new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
		);
	}

	function getHighlightedValue() {
		return contentEl?.querySelector<HTMLElement>('[data-select-item][data-highlighted]')?.dataset
			.value;
	}

	function selectActiveItem() {
		const target =
			filteredItems.find((item) => item.value === getHighlightedValue() && !item.disabled) ??
			filteredItems.find((item) => !item.disabled);

		if (!target) return;

		if (target.value === value) {
			if (allowDeselect) value = '';
		} else {
			value = target.value;
		}

		open = false;
	}

	function handleSearchKeydown(event: KeyboardEvent) {
		if (event.isComposing) return;

		if (event.key === 'Escape') {
			if (normalizedSearch !== '') {
				event.preventDefault();
				event.stopPropagation();
				search = '';
			} else {
				open = false;
			}
			return;
		}

		if (event.key === 'Tab') {
			event.preventDefault();
			open = false;
			triggerEl?.focus();
			return;
		}

		if (event.key === 'Enter') {
			event.preventDefault();
			selectActiveItem();
			return;
		}

		if (navigationKeys.has(event.key)) {
			event.preventDefault();
			forwardKey(event.key);
		}
	}
</script>

<Select.Root type="single" {items} bind:value {allowDeselect} bind:open>
	<Select.Trigger class={triggerClass} aria-label={ariaLabel} bind:ref={triggerEl}>
		{@render icon?.()}
		<Select.Value {placeholder} class="min-w-0 flex-1 truncate" />
		<ChevronDown class="ml-auto size-6 shrink-0 text-muted-foreground" />
	</Select.Trigger>
	<Select.Portal>
		<Select.Content
			class="focus-override data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 h-96 max-h-(--bits-select-content-available-height) w-max max-w-[min(90vw,24rem)] min-w-(--bits-select-anchor-width) rounded-xl border border-muted bg-background px-1 py-3 shadow-popover outline-hidden select-none data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1 {contentClass}"
			sideOffset={10}
			bind:ref={contentEl}
		>
			{#if searchable}
				<div class="flex items-center gap-2 px-3 pb-2" role="presentation">
					<Search class="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
					<input
						bind:this={searchInput}
						bind:value={search}
						onkeydown={handleSearchKeydown}
						type="text"
						class="h-8 min-w-0 flex-1 bg-transparent text-sm outline-hidden select-text placeholder:text-foreground-alt/50"
						placeholder={searchPlaceholder}
						aria-label={searchPlaceholder}
						autocomplete="off"
						spellcheck="false"
					/>
				</div>
			{/if}
			<Select.ScrollUpButton class="flex w-full items-center justify-center">
				<ChevronUp class="size-3" />
			</Select.ScrollUpButton>
			<Select.Viewport class="p-1">
				{#each filteredItems as item, i (i + item.value)}
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
				{#if filteredItems.length === 0}
					<div class="px-5 py-3 text-sm text-muted-foreground">No results found</div>
				{/if}
			</Select.Viewport>
			<Select.ScrollDownButton class="flex w-full items-center justify-center">
				<ChevronDown class="size-3" />
			</Select.ScrollDownButton>
		</Select.Content>
	</Select.Portal>
</Select.Root>
