import { db } from '../index.ts';
import { booking_links_table, booking_page_table } from '../schema.ts';
import { and, asc, eq } from 'drizzle-orm';

// ------------------------READ--------------------------

export const getBookingLinksByPageId = async ({ booking_page_id }: { booking_page_id: string }) => {
	return db.query.booking_links_table.findMany({
		where: (links) => eq(links.booking_page_id, booking_page_id),
		orderBy: (links, { asc }) => [asc(links.created_at)]
	});
};

export const getBookingLinksByUsername = async ({ username }: { username: string }) => {
	return db
		.select({
			id: booking_links_table.id,
			booking_page_id: booking_links_table.booking_page_id,
			url: booking_links_table.url,
			name: booking_links_table.name,
			description: booking_links_table.description,
			duration_minutes: booking_links_table.duration_minutes,
			created_at: booking_links_table.created_at,
			updated_at: booking_links_table.updated_at
		})
		.from(booking_links_table)
		.innerJoin(booking_page_table, eq(booking_links_table.booking_page_id, booking_page_table.id))
		.where(eq(booking_page_table.username, username))
		.orderBy(asc(booking_links_table.created_at));
};

export const getBookingLinkById = async ({ id }: { id: string }) => {
	return db.query.booking_links_table.findFirst({
		where: (links) => eq(links.id, id)
	});
};

export const getBookingLinkByPageIdAndUrl = async ({
	booking_page_id,
	url
}: {
	booking_page_id: string;
	url: string;
}) => {
	return db.query.booking_links_table.findFirst({
		where: (links) => and(eq(links.booking_page_id, booking_page_id), eq(links.url, url))
	});
};

// ------------------------CREATE--------------------------

export const createBookingLink = async ({
	booking_page_id,
	url,
	name,
	description,
	duration_minutes
}: {
	booking_page_id: string;
	url: string;
	name: string;
	description?: string | null;
	duration_minutes: number;
}) => {
	const [link] = await db
		.insert(booking_links_table)
		.values({ booking_page_id, url, name, description, duration_minutes })
		.returning();

	return link;
};

// ------------------------UPDATE--------------------------

export const updateBookingLink = async ({
	id,
	url,
	name,
	description,
	duration_minutes
}: {
	id: string;
	url?: string;
	name?: string;
	description?: string | null;
	duration_minutes?: number;
}) => {
	const updates: Partial<
		Pick<
			typeof booking_links_table.$inferInsert,
			'url' | 'name' | 'description' | 'duration_minutes'
		>
	> = {};

	if (url !== undefined) updates.url = url;
	if (name !== undefined) updates.name = name;
	if (description !== undefined) updates.description = description;
	if (duration_minutes !== undefined) updates.duration_minutes = duration_minutes;

	// Nothing to update — avoid an empty SET clause.
	if (Object.keys(updates).length === 0) return undefined;

	const [link] = await db
		.update(booking_links_table)
		.set({ ...updates, updated_at: new Date() })
		.where(eq(booking_links_table.id, id))
		.returning();

	return link;
};

// ------------------------DELETE--------------------------

export const deleteBookingLink = async ({ id }: { id: string }) => {
	const [link] = await db
		.delete(booking_links_table)
		.where(eq(booking_links_table.id, id))
		.returning();

	return link;
};
