export interface BookingDate {
	day: number;
	month: number;
	year: number;
}

export interface BookingSlot {
	slot_hour: number;
	slot_mins: number;
	slot_format?: '12h' | '24h';
}

class BookingStore {
	booking_date = $state<BookingDate>({
		day: 0,
		month: 0,
		year: 0
	});
	booking_slot = $state<BookingSlot>({
		slot_hour: 0,
		slot_mins: 0,
		slot_format: undefined
	});
	setBookingDate(date: BookingDate) {
		this.booking_date = date;
	}
}

export const stage_store = new BookingStore();
