<script lang="ts">
	const slots = [
		'04:00',
		'05:00',
		'06:00',
		'07:00',
		'08:00',
		'09:00',
		'10:00',
		'11:00',
		'12:00',
		'13:00',
		'14:00',
		'15:00',
		'16:00',
		'17:00',
		'18:00',
		'19:00',
		'20:00',
		'21:00',
		'22:00',
		'23:00',
		'24:00'
	];
</script>

<section class="scrollbar-custom grid max-h-100 gap-1.5 overflow-auto">
	{#each slots as slot (slot)}
		<div
			class="cursor-pointer rounded-lg bg-gray-100 px-2 py-1.5 text-center hover:bg-gray-900 hover:text-gray-50"
		>
			{slot}
		</div>
	{/each}
</section>
