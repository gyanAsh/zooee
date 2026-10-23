import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import { getUserById } from '$lib/server/db/queries/user.js';
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
	displayNameSchema,
	usernameSchema,
	bioSchema,
	imageUrlSchema
} from '$lib/validation-schemas/booking-page.js';

const field = (form: FormData, key: string) => String(form.get(key) ?? '');

function isUniqueViolation(err: unknown): boolean {
	return (
		typeof err === 'object' &&
		err !== null &&
		'code' in err &&
		(err as { code?: string }).code === '23505'
	);
}

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/sign-in');

	const bookingPage = await getBookingPageByUserId({ user_id: locals.user.id });

	return { bookingPage };
};

export const actions: Actions = {
	update_display_name: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/sign-in');

		const form = await request.formData();
		const parsed = displayNameSchema.safeParse(field(form, 'name'));
		if (!parsed.success) {
			return fail(400, {
				success: false,
				message: parsed.error.issues[0]?.message ?? 'Invalid display name.'
			});
		}
		const user = locals.user;

		const page = await updateBookingPageDisplayName({
			user_id: user.id,
			display_name: parsed.data
		});
		if (!page) return fail(404, { success: false, message: 'Booking page not found.' });

		return { success: true, message: 'Display name updated.' };
	},

	update_username: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/sign-in');

		const form = await request.formData();
		const parsed = usernameSchema.safeParse(field(form, 'username'));
		if (!parsed.success) {
			return fail(400, {
				success: false,
				message: parsed.error.issues[0]?.message ?? 'Invalid username.'
			});
		}

		const user = locals.user;

		try {
			const page = await updateBookingPageUsername({
				user_id: user.id,
				username: parsed.data
			});
			if (!page) return fail(404, { success: false, message: 'Booking page not found.' });
		} catch (err) {
			if (isUniqueViolation(err)) {
				return fail(409, { success: false, message: 'That username is already taken.' });
			}
			throw err;
		}

		return { success: true, message: 'Username updated.' };
	},

	update_bio: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/sign-in');

		const form = await request.formData();
		const parsed = bioSchema.safeParse(field(form, 'bio'));
		if (!parsed.success) {
			return fail(400, {
				success: false,
				message: parsed.error.issues[0]?.message ?? 'Invalid bio.'
			});
		}
		const user = locals.user;

		const page = await updateBookingPageBio({ user_id: user.id, bio: parsed.data });
		if (!page) return fail(404, { success: false, message: 'Booking page not found.' });

		return { success: true, message: 'Bio updated.' };
	},

	update_user_image: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/sign-in');
		const user = await getUserById({ id: locals.user.id });
		if (!user) return fail(404, { success: false, message: 'User not found.' });

		const form = await request.formData();
		const parsed = imageUrlSchema.safeParse(field(form, 'user_image_url'));
		if (!parsed.success) {
			return fail(400, {
				success: false,
				message: parsed.error.issues[0]?.message ?? 'Invalid image URL.'
			});
		}

		const page = await updateBookingPageImageUrl({
			user_id: user.id,
			user_image_url: parsed.data
		});
		if (!page) return fail(404, { success: false, message: 'Booking page not found.' });

		return { success: true, message: 'Profile image updated.' };
	},

	update_banner: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/sign-in');
		const user = await getUserById({ id: locals.user.id });
		if (!user) return fail(404, { success: false, message: 'User not found.' });

		const form = await request.formData();
		const parsed = imageUrlSchema.safeParse(field(form, 'banner_url'));
		if (!parsed.success) {
			return fail(400, {
				success: false,
				message: parsed.error.issues[0]?.message ?? 'Invalid banner URL.'
			});
		}

		const page = await updateBookingPageBannerUrl({
			user_id: user.id,
			banner_url: parsed.data
		});
		if (!page) return fail(404, { success: false, message: 'Booking page not found.' });

		return { success: true, message: 'Banner updated.' };
	},

	create_booking_page: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/sign-in');

		const form = await request.formData();

		const parsedDisplayName = displayNameSchema.safeParse(field(form, 'display_name'));
		if (!parsedDisplayName.success) {
			return fail(400, {
				success: false,
				message: parsedDisplayName.error.issues[0]?.message ?? 'Invalid display name.'
			});
		}

		const parsedUsername = usernameSchema.safeParse(field(form, 'username'));
		if (!parsedUsername.success) {
			return fail(400, {
				success: false,
				message: parsedUsername.error.issues[0]?.message ?? 'Invalid username.'
			});
		}

		// Optional fields: an empty string is normalized to null by the schemas.
		const parsedBio = bioSchema.safeParse(field(form, 'bio'));
		if (!parsedBio.success) {
			return fail(400, {
				success: false,
				message: parsedBio.error.issues[0]?.message ?? 'Invalid bio.'
			});
		}

		try {
			const takeUserName = await getBookingPageByUsername({ username: parsedUsername.data });
			if (takeUserName) {
				return fail(409, { success: false, message: 'Username already taken' });
			}

			const page = await createBookingPage({
				user_id: locals.user.id,
				display_name: parsedDisplayName.data,
				username: parsedUsername.data,
				bio: parsedBio.data
			});

			return { success: true, message: 'Booking page created.', page };
		} catch (err) {
			if (isUniqueViolation(err)) {
				return fail(409, { success: false, message: 'That username is already taken.' });
			}
			throw err;
		}
	}
};
