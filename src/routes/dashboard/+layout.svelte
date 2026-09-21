<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';

	const { children } = $props();
</script>

<nav>
	<a href={resolve('/')}>home</a>
	<a href={resolve('/dashboard' as Pathname)}>dashboard</a>
	<a href={resolve('/dashboard/moodboard' as Pathname)}>moodboard</a>
</nav>
{@render children()}
