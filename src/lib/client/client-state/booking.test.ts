import { describe, expect, it } from 'vitest';
import {
	add_minutes_to_slot,
	format_booking_date,
	format_booking_slot,
	get_india_date
} from './booking.svelte';

describe('format_booking_date', () => {
	it('formats a booking date', () => {
		expect(format_booking_date({ year: 2026, month: 10, day: 28, week: 'Wednesday' })).toBe(
			'Wednesday, October 28, 2026'
		);
	});

	it('returns an empty string for an unset date', () => {
		expect(format_booking_date({ year: 0, month: 0, day: 0, week: 'Wednesday' })).toBe('');
	});
});

describe('add_minutes_to_slot', () => {
	it('adds minutes within the hour', () => {
		expect(add_minutes_to_slot({ slot_hour: 9, slot_mins: 15, slot_format: '24h' }, 30)).toEqual({
			slot_hour: 9,
			slot_mins: 45,
			slot_format: '24h'
		});
	});

	it('wraps around midnight', () => {
		expect(add_minutes_to_slot({ slot_hour: 23, slot_mins: 30, slot_format: '24h' }, 45)).toEqual({
			slot_hour: 0,
			slot_mins: 15,
			slot_format: '24h'
		});
	});

	it('supports negative minutes', () => {
		expect(add_minutes_to_slot({ slot_hour: 0, slot_mins: 15, slot_format: '24h' }, -30)).toEqual({
			slot_hour: 23,
			slot_mins: 45,
			slot_format: '24h'
		});
	});
});

describe('format_booking_slot', () => {
	it('formats 24h slots', () => {
		expect(format_booking_slot({ slot_hour: 9, slot_mins: 5, slot_format: '24h' })).toBe('09:05');
	});

	it('formats 12h slots', () => {
		expect(format_booking_slot({ slot_hour: 9, slot_mins: 5, slot_format: '12h' })).toBe('9:05 AM');
		expect(format_booking_slot({ slot_hour: 0, slot_mins: 0, slot_format: '12h' })).toBe(
			'12:00 AM'
		);
		expect(format_booking_slot({ slot_hour: 12, slot_mins: 0, slot_format: '12h' })).toBe(
			'12:00 PM'
		);
	});
});

describe('get_india_date', () => {
	it('returns the calendar date in India', () => {
		const date = new Date('2026-10-28T23:30:00Z');

		expect(get_india_date(date)).toEqual({ year: 2026, month: 10, day: 29 });
	});
});
