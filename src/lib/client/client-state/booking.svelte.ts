import { TZDate } from '@date-fns/tz';
import { addMinutes, format, getDate, getHours, getMinutes, getMonth, getYear } from 'date-fns';
import { SvelteDate } from 'svelte/reactivity';

const INDIA_TIMEZONE = 'Asia/Kolkata';

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

export interface CalendarDate {
	year: number;
	/** 1-12 */
	month: number;
	day: number;
}

/** Returns the calendar date in India for the given instant. */
export function get_india_date(date: Date = new SvelteDate()): CalendarDate {
	const zoned = TZDate.tz(INDIA_TIMEZONE, date);

	return { year: getYear(zoned), month: getMonth(zoned) + 1, day: getDate(zoned) };
}

export function format_booking_date(date: BookingDate): string {
	if (date.day <= 0 || date.month <= 0 || date.year <= 0) return '';

	return format(TZDate.tz('UTC', date.year, date.month - 1, date.day), 'EEEE, MMMM d, yyyy');
}

export function add_minutes_to_slot(slot: BookingSlot, minutes: number): BookingSlot {
	const date = TZDate.tz('UTC', 2000, 0, 1, slot.slot_hour, slot.slot_mins);
	const next = addMinutes(date, minutes);

	return {
		slot_hour: getHours(next),
		slot_mins: getMinutes(next),
		slot_format: slot.slot_format
	};
}

export function format_booking_slot(slot: BookingSlot): string {
	const date = TZDate.tz('UTC', 2000, 0, 1, slot.slot_hour % 24, slot.slot_mins);

	return format(date, slot.slot_format === '12h' ? 'h:mm a' : 'HH:mm');
}

class BookingStore {
	/** Today's calendar date in India, where all bookings are handled. */
	today = $derived(get_india_date());

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
