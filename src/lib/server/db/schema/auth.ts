import { boolean, index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { users_table } from './user.ts';
import { sql } from 'drizzle-orm';

export const refresh_token_table = pgTable(
	'refresh_tokens',
	{
		token_hash: text('token_hash').primaryKey().notNull(),
		user_id: text('user_id')
			.notNull()
			.references(() => users_table.id, { onDelete: 'cascade' }),
		created_at: timestamp('created_at', { withTimezone: true }).notNull(),
		expires_at: timestamp('expires_at', { withTimezone: true }).notNull(),
		revoked: boolean().notNull().default(false)
	},
	(t) => [
		index('idx_refresh_user').on(t.user_id),
		index('idx_refresh_expired_revoked')
			.on(t.expires_at)
			.where(sql`${t.revoked} = true`)
	]
);

export type typeof_refresh_token_table = typeof refresh_token_table.$inferInsert;
