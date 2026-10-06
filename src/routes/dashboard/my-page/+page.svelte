<script lang="ts">
	import AppointmentInfo from './AppointmentInfo.svelte';
	import Calender from './Calender.svelte';
	import TimeSlot from './TimeSlot.svelte';
</script>

<section
	style="background: radial-gradient(125% 125% at 50% 10%, #fff 40%, #6366f1 100%);"
	class="flex h-full items-center justify-center rounded-sm"
>
	<div
		class="grid aspect-10/5 w-full max-w-5xl grid-cols-6 gap-5 rounded-card-lg border bg-white p-5 shadow-2xl"
	>
		<section class="col-span-2">
			<AppointmentInfo />
		</section>
		<section class="col-span-4">
			<Calender />
			<TimeSlot />
		</section>
	</div>
</section>

<!-- these sections below are draggable ( order can be changed in the dashboard ) -->
<!-- <section>
			<button>Add anouncements/discounts</button>
			<button>Connect Google Calender For appointemtns</button>
			<button>Add Products</button>
		</section>
		<section>
			<button>Add Links</button>
		</section> -->
