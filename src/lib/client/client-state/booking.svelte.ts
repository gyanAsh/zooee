import { SvelteDate } from 'svelte/reactivity';

export type Weekday =
	'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface BookingDate {
	day: number;
	/** 1-12 */
	month: number;
	year: number;
	week: Weekday;
}

export interface BookingSlot {
	slot_hour: number;
	slot_mins: number;
	slot_format: '12h' | '24h';
}

export interface BookingUserDetails {
	name: string;
	address: string;
	additional_notes: string;
}

export interface TimezoneDate {
	year: number;
	/** 1-12 */
	month: number;
	day: number;
}

const month_names = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
];

export function get_system_timezone(): string {
	try {
		return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
	} catch {
		return 'UTC';
	}
}

/** Returns the current calendar date in the given IANA timezone. */
export function get_timezone_date(timezone: string, date: Date = new SvelteDate()): TimezoneDate {
	try {
		const parts = new Intl.DateTimeFormat('en-US', {
			timeZone: timezone,
			year: 'numeric',
			month: 'numeric',
			day: 'numeric'
		}).formatToParts(date);

		const value = (type: Intl.DateTimeFormatPartTypes) =>
			Number(parts.find((part) => part.type === type)?.value ?? 0);

		return { year: value('year'), month: value('month'), day: value('day') };
	} catch {
		return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
	}
}

export function format_booking_date(date: BookingDate): string {
	if (date.day <= 0 || date.month <= 0 || date.year <= 0) return '';

	return `${date.week}, ${month_names[date.month - 1]} ${date.day}, ${date.year}`;
}

export function add_minutes_to_slot(slot: BookingSlot, minutes: number): BookingSlot {
	const minutes_in_day = 24 * 60;
	const total = slot.slot_hour * 60 + slot.slot_mins + minutes;
	const wrapped = ((total % minutes_in_day) + minutes_in_day) % minutes_in_day;

	return {
		slot_hour: Math.floor(wrapped / 60),
		slot_mins: wrapped % 60,
		slot_format: slot.slot_format
	};
}

export function format_booking_slot(slot: BookingSlot): string {
	const hour = slot.slot_hour % 24;
	const mins = String(slot.slot_mins).padStart(2, '0');

	if (slot.slot_format === '12h') {
		const period = hour >= 12 ? 'PM' : 'AM';
		const hour12 = hour % 12 || 12;

		return `${hour12}:${mins} ${period}`;
	}

	return `${String(hour).padStart(2, '0')}:${mins}`;
}

class BookingStore {
	timezone = $state<string>(get_system_timezone());

	booking_date = $state<BookingDate>({
		day: 0,
		month: 0,
		year: 0,
		week: 'Wednesday'
	});
	booking_slot = $state<BookingSlot>({
		slot_hour: 0,
		slot_mins: 0,
		slot_format: '24h'
	});

	booking_user_details = $state<BookingUserDetails>({
		name: '',
		address: '',
		additional_notes: ''
	});
}

export const booking_store = new BookingStore();
