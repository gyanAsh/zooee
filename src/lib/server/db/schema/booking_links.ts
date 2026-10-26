import { sql } from 'drizzle-orm';
import {
	check,
	integer,
	pgTable,
	timestamp,
	uniqueIndex,
	uuid,
	varchar
} from 'drizzle-orm/pg-core';
import { booking_page_table } from './booking_page.ts';

export const booking_links_table = pgTable(
	'booking_links',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		booking_page_id: uuid('booking_page_id')
			.notNull()
			.references(() => booking_page_table.id, { onDelete: 'cascade' }),
		url: varchar('url', { length: 60 }).notNull(),
		name: varchar('name', { length: 100 }).notNull(),
		description: varchar('description', { length: 500 }),
		duration_minutes: integer('duration_minutes').notNull(),
		created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
	},
	(t) => [
		uniqueIndex('uq_booking_links_page_url').on(t.booking_page_id, t.url),
		check('chk_booking_links_duration_positive', sql`${t.duration_minutes} > 0`)
	]
);

export type typeof_booking_links_table = typeof booking_links_table.$inferInsert;
