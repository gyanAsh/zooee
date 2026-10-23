<script lang="ts">
	import { AtSign, CalendarPlus, CircleAlert, FileText, User } from '@lucide/svelte';
	import {
		displayNameSchema,
		usernameSchema,
		bioSchema
	} from '$lib/validation-schemas/booking-page.js';
	import type { SubmitFunction } from './$types.js';
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import Button from '$lib/client/components/ui/button.svelte';
	let { form } = $props();

	// ---- create booking page form ----
	let displayName = $state('');
	let username = $state('');
	let bio = $state('');
	let submitting = $state(false);
	let errors = $state<Record<string, string | null>>({});
	let touched = $state<Record<string, boolean>>({});
	let validValues = $derived(errors.display_name === null && errors.username === null);

	const fieldSchemas = {
		display_name: displayNameSchema,
		username: usernameSchema,
		bio: bioSchema
	} as const;

	type FieldKey = keyof typeof fieldSchemas;

	const fieldValues: Record<FieldKey, () => string> = {
		display_name: () => displayName,
		username: () => username,
		bio: () => bio
	};

	function validateField(key: FieldKey): string | null {
		const result = fieldSchemas[key].safeParse(fieldValues[key]());
		return result.success ? null : (result.error.issues[0]?.message ?? 'Invalid value');
	}

	function onInput(key: FieldKey) {
		if (touched[key]) errors[key] = validateField(key);
	}

	function onBlur(key: FieldKey) {
		touched[key] = true;
		errors[key] = validateField(key);
	}

	function validateAll(): boolean {
		let valid = true;
		for (const key of Object.keys(fieldSchemas) as FieldKey[]) {
			touched[key] = true;
			const err = validateField(key);
			errors[key] = err;
			if (err) valid = false;
		}
		return valid;
	}

	const showError = (key: FieldKey) => touched[key] && !!errors[key];

	const inputClass = (hasError: boolean) => `w-full rounded-lg border-2 px-2.5 py-1.5
       	${hasError ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100 '}
       	text-sm transition-colors focus:border-blue-500 focus:ring-1 focus:ring-transparent focus:outline-none`;

	const submitHandler: SubmitFunction = ({ cancel }) => {
		if (!validateAll()) cancel();
		submitting = true;
		return async ({ update }) => {
			await update({ reset: false });
			submitting = false;
		};
	};
</script>

<section
	class="mt-10 grid h-fit w-full max-w-xl gap-5 rounded-4xl border bg-[#FCFBF7] p-6 text-sm"
	in:fly={{ y: -10, duration: 130, easing: cubicOut }}
>
	<header class="grid gap-1">
		<h1 class="text-xl font-bold tracking-tight">Create your booking page</h1>
		<p class="text-gray-500">
			This is your public profile where people can book time with you. Only the display name and
			username are required.
		</p>
	</header>

	{#if form && !form.success}
		<div
			class="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-2 py-1.5 text-red-700"
			role="alert"
		>
			<CircleAlert size="16" strokeWidth="2" class="shrink-0" />
			<span class="font-medium">{form.message}</span>
		</div>
	{/if}

	<form
		method="POST"
		action="?/create_booking_page"
		use:enhance={submitHandler}
		class="grid gap-4"
		novalidate
	>
		<div class="grid gap-1.5">
			<label for="display_name" class="font-medium">
				Display name <span class="text-red-500">*</span>
			</label>
			<div class="relative">
				<User
					size="15"
					strokeWidth="2"
					class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
				/>
				<input
					id="display_name"
					name="display_name"
					bind:value={displayName}
					oninput={() => onInput('display_name')}
					onblur={() => onBlur('display_name')}
					placeholder="Jane Doe"
					maxlength="50"
					autocomplete="name"
					aria-invalid={showError('display_name')}
					class={inputClass(showError('display_name')) + ' pl-9'}
				/>
			</div>
			{#if showError('display_name')}
				<p class="text-xs font-medium text-red-500">* {errors.display_name}</p>
			{/if}
		</div>

		<div class="grid gap-1.5">
			<label for="username" class="font-medium">
				Username <span class="text-red-500">*</span>
			</label>
			<div class="relative">
				<AtSign
					size="15"
					strokeWidth="2"
					class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
				/>
				<input
					id="username"
					name="username"
					bind:value={username}
					oninput={() => onInput('username')}
					onblur={() => onBlur('username')}
					placeholder="jane-doe"
					maxlength="30"
					autocomplete="off"
					spellcheck="false"
					aria-invalid={showError('username')}
					class={inputClass(showError('username')) + ' pl-8'}
				/>
			</div>
			<p class="text-xs text-gray-500">
				3–30 characters. Lowercase letters, numbers, <span class="font-mono">-</span> or
				<span class="font-mono">_</span>. This becomes your public link.
			</p>
			{#if showError('username')}
				<p class="text-xs font-medium text-red-500">* {errors.username}</p>
			{/if}
		</div>

		<div class="grid gap-1.5">
			<div class="flex items-baseline justify-between">
				<label for="bio" class="font-medium">Bio</label>
				<span class="text-xs text-gray-400 {bio.trim().length >= 160 ? 'text-red-500' : ''}">
					{bio.trim().length}/160
				</span>
			</div>
			<div class="relative">
				<FileText
					size="15"
					strokeWidth="2"
					class="pointer-events-none absolute top-3 left-3 text-gray-400"
				/>
				<textarea
					id="bio"
					name="bio"
					bind:value={bio}
					oninput={() => onInput('bio')}
					onblur={() => onBlur('bio')}
					rows="3"
					placeholder="Tell people what they can book with you..."
					class={inputClass(showError('bio')) + ' resize-none pl-9'}></textarea>
			</div>
			{#if showError('bio')}
				<p class="text-xs font-medium text-red-500">* {errors.bio}</p>
			{/if}
		</div>

		<div class="flex items-center justify-end gap-2 pt-1">
			<Button
				variant="ghost"
				onClick={() => {
					displayName = '';
					username = '';
					bio = '';
					errors = {};
					touched = {};
				}}
			>
				Clear
			</Button>
			<Button
				type={validValues ? 'submit' : 'button'}
				variant={submitting ? 'secondary' : validValues ? 'primary' : 'black'}
				class={submitting ? 'pointer-events-none opacity-70' : ''}
			>
				<div class="inline-flex items-center gap-1.5 text-sm font-medium">
					<CalendarPlus size="15" strokeWidth="2.5" />
					<span>{submitting ? 'Creating...' : 'Create Booking Page'}</span>
				</div>
			</Button>
		</div>
	</form>
</section>
