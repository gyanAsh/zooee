<script lang="ts">
	const deleteAllUsers = async () => {
		const res = await fetch('/api/test/delete_users', {
			method: 'DELETE'
		});
		const resdata = await res.json();
		console.log({ resdata });
	};
	const deleteAllBookingPages = async () => {
		const res = await fetch('/api/test/delete_bookings', {
			method: 'DELETE'
		});
		const resdata = await res.json();
		console.log({ resdata });
	};

	const runApp = async () => {
		// Download the result
		const api_key = 'pf_live_GlIxYU8t96k5Lsk4yFuCqHk5G9xPxaPJ';
		const website = 'https://dodopayments.com';
	};
</script>

<section class="grid place-items-center gap-1">
	<h1>Dashboard</h1>
	<div class="flex items-center gap-2.5">
		<button onclick={deleteAllUsers} class="bg-blue-500 px-2 py-1 text-sm">
			Delete all user
		</button>
		<button onclick={deleteAllBookingPages} class="bg-blue-500 px-2 py-1 text-sm">
			Delete all Booking pages
		</button>
	</div>
</section>
