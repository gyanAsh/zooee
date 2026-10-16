<script lang="ts">
	const deleteAllUsers = async () => {
		const res = await fetch('/api/test/delete_users', {
			method: 'DELETE'
		});
		const resdata = await res.json();
		console.log({ resdata });
	};
</script>

<section class="grid place-items-center gap-1">
	<h1>Dashboard</h1>

	<button onclick={deleteAllUsers} class="bg-blue-500 px-2 py-1 text-sm"> Delete all user </button>
</section>
