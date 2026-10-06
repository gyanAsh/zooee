<script lang="ts">
	import './layout.css';

	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import House from '@lucide/svelte/icons/house';
	import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
	import User from '@lucide/svelte/icons/user';
	import Calendar from '@lucide/svelte/icons/calendar';
	import GraduationCap from '@lucide/svelte/icons/graduation-cap';
	import ShoppingBag from '@lucide/svelte/icons/shopping-bag';
	import type { Pathname } from '$app/types';
	import { fly } from 'svelte/transition';
	import { cubicIn, cubicOut } from 'svelte/easing';

	const { children } = $props();
	const links = [
		{ path: '/', title: 'Home', icon: House },
		{ path: '/dashboard', title: 'Dashboard', icon: LayoutDashboard },
		{ path: '/dashboard/my-page', title: 'My Page', icon: User },
		{ path: '/dashboard/appointments', title: 'Appointments', icon: Calendar },
		{ path: '/dashboard/courses', title: 'Courses', icon: GraduationCap },
		{ path: '/dashboard/products', title: 'Products', icon: ShoppingBag }
	];
</script>

<section class="flex h-dvh w-dvw bg-[#F5F5F5]">
	{#if page.url.pathname !== '/'}
		<nav
			class="m-2 flex w-50 flex-col gap-1 p-2"
			in:fly={{ x: -10, duration: 130, easing: cubicOut }}
			out:fly={{ x: -10, duration: 130, easing: cubicIn }}
		>
			{#each links as { path, icon: Icon, title } (path)}
				{@const isActive = page.url.pathname === path}

				<a
					href={resolve(path as Pathname)}
					class="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors {isActive
						? 'bg-blue-500 font-semibold text-white'
						: 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'}"
					aria-current={isActive ? 'page' : undefined}
				>
					<Icon size={18} strokeWidth={2} />
					<span>{title}</span>
				</a>
			{/each}
		</nav>
	{/if}
	<div class="m-2 grow rounded-lg border bg-[#FDFDFD] p-2">
		{@render children()}
	</div>
</section>
