import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import {
	getBookingPageByUserId,
	createBookingPage,
	updateBookingPageDisplayName,
	updateBookingPageUsername,
	updateBookingPageBio,
	updateBookingPageImageUrl,
	updateBookingPageBannerUrl,
	getBookingPageByUsername
} from '$lib/server/db/queries/booking_page.js';
import {
	createBookingLink,
	deleteBookingLink,
	getBookingLinkById,
	getBookingLinkByPageIdAndUrl,
	getBookingLinksByPageId,
	updateBookingLink
} from '$lib/server/db/queries/booking_links.js';
import {
	displayNameSchema,
	usernameSchema,
	bioSchema,
	imageUrlSchema
} from '$lib/validation-schemas/booking-page.js';
import {
	bookingLinkDescriptionSchema,
	bookingLinkDurationSchema,
	bookingLinkNameSchema,
	bookingLinkUrlSchema
} from '$lib/validation-schemas/booking-links.js';

const field = (form: FormData, key: string) => String(form.get(key) ?? '');

type FieldType =
	| 'name'
	| 'username'
	| 'bio'
	| 'user_image'
	| 'banner_image'
	| 'booking_page'
	| 'booking_link'
	| 'booking_link_name'
	| 'booking_link_url'
	| 'booking_link_description'
	| 'booking_link_duration';

/** Success response — T keeps the exact literal type. */
function ok<T extends FieldType>(type: T, message: string) {
	return { success: true as const, type, message };
}

/** Failure response — T keeps the exact literal type. */
function failWith<T extends FieldType>(status: number, type: T, message: string) {
	return fail(status, { success: false as const, type, message });
}

/** Single auth guard instead of repeating it in every action. */
function requireUser(locals: App.Locals) {
	if (!locals.user) throw redirect(303, '/sign-in');
	return locals.user;
}

function isUniqueViolation(err: unknown): boolean {
	return (
		typeof err === 'object' &&
		err !== null &&
		'code' in err &&
		(err as { code?: string }).code === '23505'
	);
}

export const load: PageServerLoad = async ({ locals }) => {
	const user = requireUser(locals);

	const bookingPage = await getBookingPageByUserId({ user_id: user.id });
	const bookingLinks = bookingPage
		? await getBookingLinksByPageId({ booking_page_id: bookingPage.id })
		: [];

	return { bookingPage, bookingLinks };
};

export const actions: Actions = {
	update_display_name: async ({ request, locals }) => {
		const user = requireUser(locals);

		const form = await request.formData();
		const parsed = displayNameSchema.safeParse(field(form, 'name'));
		if (!parsed.success) {
			return failWith(400, 'name', parsed.error.issues[0]?.message ?? 'Invalid display name.');
		}

		const page = await updateBookingPageDisplayName({
			user_id: user.id,
			display_name: parsed.data
		});
		if (!page) return failWith(404, 'name', 'Booking page not found.');

		return ok('name', 'Display name updated.');
	},

	update_username: async ({ request, locals }) => {
		const user = requireUser(locals);

		const form = await request.formData();
		const parsed = usernameSchema.safeParse(field(form, 'username'));
		if (!parsed.success) {
			return failWith(400, 'username', parsed.error.issues[0]?.message ?? 'Invalid username.');
		}

		try {
			const page = await updateBookingPageUsername({
				user_id: user.id,
				username: parsed.data
			});
			if (!page) return failWith(404, 'username', 'Booking page not found.');
		} catch (err) {
			if (isUniqueViolation(err)) {
				return failWith(409, 'username', 'That username is already taken.');
			}
			throw err;
		}

		return ok('username', 'Username updated.');
	},

	update_bio: async ({ request, locals }) => {
		const user = requireUser(locals);

		const form = await request.formData();
		const parsed = bioSchema.safeParse(field(form, 'bio'));
		if (!parsed.success) {
			return failWith(400, 'bio', parsed.error.issues[0]?.message ?? 'Invalid bio.');
		}

		const page = await updateBookingPageBio({ user_id: user.id, bio: parsed.data });
		if (!page) return failWith(404, 'bio', 'Booking page not found.');

		return ok('bio', 'Bio updated.');
	},

	update_user_image: async ({ request, locals }) => {
		const user = requireUser(locals);

		const form = await request.formData();
		const parsed = imageUrlSchema.safeParse(field(form, 'user_image_url'));
		if (!parsed.success) {
			return failWith(400, 'user_image', parsed.error.issues[0]?.message ?? 'Invalid image URL.');
		}

		const page = await updateBookingPageImageUrl({
			user_id: user.id,
			user_image_url: parsed.data
		});
		if (!page) return failWith(404, 'user_image', 'Booking page not found.');

		return ok('user_image', 'Profile image updated.');
	},

	update_banner: async ({ request, locals }) => {
		const user = requireUser(locals);

		const form = await request.formData();
		const parsed = imageUrlSchema.safeParse(field(form, 'banner_url'));
		if (!parsed.success) {
			return failWith(
				400,
				'banner_image',
				parsed.error.issues[0]?.message ?? 'Invalid banner URL.'
			);
		}

		const page = await updateBookingPageBannerUrl({
			user_id: user.id,
			banner_url: parsed.data
		});
		if (!page) return failWith(404, 'banner_image', 'Booking page not found.');

		return ok('banner_image', 'Banner updated.');
	},

	create_booking_page: async ({ request, locals }) => {
		const user = requireUser(locals);

		const form = await request.formData();

		const parsedDisplayName = displayNameSchema.safeParse(field(form, 'display_name'));
		if (!parsedDisplayName.success) {
			return failWith(
				400,
				'booking_page',
				parsedDisplayName.error.issues[0]?.message ?? 'Invalid display name.'
			);
		}

		const parsedUsername = usernameSchema.safeParse(field(form, 'username'));
		if (!parsedUsername.success) {
			return failWith(
				400,
				'booking_page',
				parsedUsername.error.issues[0]?.message ?? 'Invalid username.'
			);
		}

		// Optional fields: an empty string is normalized to null by the schemas.
		const parsedBio = bioSchema.safeParse(field(form, 'bio'));
		if (!parsedBio.success) {
			return failWith(400, 'booking_page', parsedBio.error.issues[0]?.message ?? 'Invalid bio.');
		}

		try {
			const takeUserName = await getBookingPageByUsername({ username: parsedUsername.data });
			if (takeUserName) {
				return failWith(409, 'booking_page', 'Username already taken');
			}

			const page = await createBookingPage({
				user_id: user.id,
				display_name: parsedDisplayName.data,
				username: parsedUsername.data,
				bio: parsedBio.data
			});

			return { ...ok('booking_page', 'Booking page created.'), page };
		} catch (err) {
			if (isUniqueViolation(err)) {
				return failWith(409, 'booking_page', 'That username is already taken.');
			}
			throw err;
		}
	},

	create_booking_link: async ({ request, locals }) => {
		const user = requireUser(locals);

		const page = await getBookingPageByUserId({ user_id: user.id });
		if (!page) return failWith(404, 'booking_link', 'Booking page not found.');

		const form = await request.formData();

		const parsedName = bookingLinkNameSchema.safeParse(field(form, 'name'));
		if (!parsedName.success) {
			return failWith(
				400,
				'booking_link_name',
				parsedName.error.issues[0]?.message ?? 'Invalid name.'
			);
		}

		const parsedUrl = bookingLinkUrlSchema.safeParse(field(form, 'url'));
		if (!parsedUrl.success) {
			return failWith(
				400,
				'booking_link_url',
				parsedUrl.error.issues[0]?.message ?? 'Invalid URL.'
			);
		}

		const parsedDescription = bookingLinkDescriptionSchema.safeParse(field(form, 'description'));
		if (!parsedDescription.success) {
			return failWith(
				400,
				'booking_link_description',
				parsedDescription.error.issues[0]?.message ?? 'Invalid description.'
			);
		}

		const parsedDuration = bookingLinkDurationSchema.safeParse(field(form, 'duration_minutes'));
		if (!parsedDuration.success) {
			return failWith(
				400,
				'booking_link_duration',
				parsedDuration.error.issues[0]?.message ?? 'Invalid duration.'
			);
		}

		const urlTaken = await getBookingLinkByPageIdAndUrl({
			booking_page_id: page.id,
			url: parsedUrl.data
		});
		if (urlTaken) {
			return failWith(409, 'booking_link_url', 'That URL is already used on this page.');
		}

		try {
			const link = await createBookingLink({
				booking_page_id: page.id,
				url: parsedUrl.data,
				name: parsedName.data,
				description: parsedDescription.data,
				duration_minutes: parsedDuration.data
			});

			return { ...ok('booking_link', 'Booking link created.'), link };
		} catch (err) {
			if (isUniqueViolation(err)) {
				return failWith(409, 'booking_link_url', 'That URL is already used on this page.');
			}
			throw err;
		}
	},

	update_booking_link: async ({ request, locals }) => {
		const user = requireUser(locals);

		const page = await getBookingPageByUserId({ user_id: user.id });
		if (!page) return failWith(404, 'booking_link', 'Booking page not found.');

		const form = await request.formData();
		const id = field(form, 'id');
		if (!id) return failWith(400, 'booking_link', 'Booking link id is required.');

		// Ownership check: never update a link that belongs to another page.
		const existing = await getBookingLinkById({ id });
		if (!existing || existing.booking_page_id !== page.id) {
			return failWith(404, 'booking_link', 'Booking link not found.');
		}

		const parsedName = bookingLinkNameSchema.safeParse(field(form, 'name'));
		if (!parsedName.success) {
			return failWith(
				400,
				'booking_link_name',
				parsedName.error.issues[0]?.message ?? 'Invalid name.'
			);
		}

		const parsedUrl = bookingLinkUrlSchema.safeParse(field(form, 'url'));
		if (!parsedUrl.success) {
			return failWith(
				400,
				'booking_link_url',
				parsedUrl.error.issues[0]?.message ?? 'Invalid URL.'
			);
		}

		const parsedDescription = bookingLinkDescriptionSchema.safeParse(field(form, 'description'));
		if (!parsedDescription.success) {
			return failWith(
				400,
				'booking_link_description',
				parsedDescription.error.issues[0]?.message ?? 'Invalid description.'
			);
		}

		const parsedDuration = bookingLinkDurationSchema.safeParse(field(form, 'duration_minutes'));
		if (!parsedDuration.success) {
			return failWith(
				400,
				'booking_link_duration',
				parsedDuration.error.issues[0]?.message ?? 'Invalid duration.'
			);
		}

		const urlTaken = await getBookingLinkByPageIdAndUrl({
			booking_page_id: page.id,
			url: parsedUrl.data
		});
		if (urlTaken && urlTaken.id !== id) {
			return failWith(409, 'booking_link_url', 'That URL is already used on this page.');
		}

		try {
			const link = await updateBookingLink({
				id,
				url: parsedUrl.data,
				name: parsedName.data,
				description: parsedDescription.data,
				duration_minutes: parsedDuration.data
			});
			if (!link) return failWith(404, 'booking_link', 'Booking link not found.');

			return { ...ok('booking_link', 'Booking link updated.'), link };
		} catch (err) {
			if (isUniqueViolation(err)) {
				return failWith(409, 'booking_link_url', 'That URL is already used on this page.');
			}
			throw err;
		}
	},

	delete_booking_link: async ({ request, locals }) => {
		const user = requireUser(locals);

		const page = await getBookingPageByUserId({ user_id: user.id });
		if (!page) return failWith(404, 'booking_link', 'Booking page not found.');

		const form = await request.formData();
		const id = field(form, 'id');
		if (!id) return failWith(400, 'booking_link', 'Booking link id is required.');

		// Ownership check: never delete a link that belongs to another page.
		const existing = await getBookingLinkById({ id });
		if (!existing || existing.booking_page_id !== page.id) {
			return failWith(404, 'booking_link', 'Booking link not found.');
		}

		const link = await deleteBookingLink({ id });
		if (!link) return failWith(404, 'booking_link', 'Booking link not found.');

		return ok('booking_link', 'Booking link deleted.');
	}
};
