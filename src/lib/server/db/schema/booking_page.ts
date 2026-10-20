import { index, jsonb, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { users_table } from './user.ts';

export const booking_page_table = pgTable(
	'booking_page',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		user_id: text('user_id')
			.notNull()
			.references(() => users_table.id, { onDelete: 'cascade' }),
		display_name: varchar('display_name', { length: 50 }).notNull(),
		username: varchar('username', { length: 30 }).notNull().unique(),
		bio: varchar('bio', { length: 160 }),
		banner_prop: jsonb('banner_prop').$type<BannerMeta>(),
		user_image: text('user_image'),
		created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
	},
	(t) => [index('idx_booking_user').on(t.user_id), index('idx_booking_username').on(t.username)]
);

interface BannerMeta {
	banner_url: string;
	show: boolean;
}
export type typeof_booking_page_table = typeof booking_page_table.$inferInsert;
