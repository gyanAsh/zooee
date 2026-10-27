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

class BookingStore {
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
