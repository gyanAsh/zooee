import { db } from '../index.ts';
import { booking_page_table } from '../schema.ts';
import { eq } from 'drizzle-orm';

// ------------------------READ--------------------------

export const getBookingPageByUserId = async ({ user_id }: { user_id: string }) => {
	return db.query.booking_page_table.findFirst({
		where: (pages) => eq(pages.user_id, user_id)
	});
};

export const getBookingPageByUsername = async ({ username }: { username: string }) => {
	return db.query.booking_page_table.findFirst({
		where: (pages) => eq(pages.username, username)
	});
};

// ------------------------CREATE--------------------------

export const createBookingPage = async ({
	user_id,
	display_name,
	username,
	bio,
	user_image_url,
	banner_url
}: {
	user_id: string;
	display_name: string;
	username: string;
	bio?: string | null;
	user_image_url?: string | null;
	banner_url?: string | null;
}) => {
	const [page] = await db
		.insert(booking_page_table)
		.values({ user_id, display_name, username, bio, user_image_url, banner_url })
		.returning();

	return page;
};

// ------------------------UPDATE--------------------------

export const updateBookingPageDisplayName = async ({
	user_id,
	display_name
}: {
	user_id: string;
	display_name: string;
}) => {
	const [page] = await db
		.update(booking_page_table)
		.set({ display_name, updated_at: new Date() })
		.where(eq(booking_page_table.user_id, user_id))
		.returning();

	return page;
};

export const updateBookingPageUsername = async ({
	user_id,
	username
}: {
	user_id: string;
	username: string;
}) => {
	const [page] = await db
		.update(booking_page_table)
		.set({ username, updated_at: new Date() })
		.where(eq(booking_page_table.user_id, user_id))
		.returning();

	return page;
};

export const updateBookingPageBio = async ({
	user_id,
	bio
}: {
	user_id: string;
	bio: string | null;
}) => {
	const [page] = await db
		.update(booking_page_table)
		.set({ bio, updated_at: new Date() })
		.where(eq(booking_page_table.user_id, user_id))
		.returning();

	return page;
};

export const updateBookingPageImageUrl = async ({
	user_id,
	user_image_url
}: {
	user_id: string;
	user_image_url: string | null;
}) => {
	const [page] = await db
		.update(booking_page_table)
		.set({ user_image_url, updated_at: new Date() })
		.where(eq(booking_page_table.user_id, user_id))
		.returning();

	return page;
};

export const updateBookingPageBannerUrl = async ({
	user_id,
	banner_url
}: {
	user_id: string;
	banner_url: string | null;
}) => {
	const [page] = await db
		.update(booking_page_table)
		.set({ banner_url, updated_at: new Date() })
		.where(eq(booking_page_table.user_id, user_id))
		.returning();

	return page;
};
