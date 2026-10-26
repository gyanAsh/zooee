import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { getBookingPageByUsername } from '$lib/server/db/queries/booking_page.js';
import { getBookingLinkByPageIdAndUrl } from '$lib/server/db/queries/booking_links.js';

function requireUser(locals: App.Locals) {
	if (!locals.user) throw redirect(303, '/sign-in');
	return locals.user;
}

export const load: PageServerLoad = async ({ locals, params }) => {
	const user = requireUser(locals);

	const username = params.usernameSlug.trim().toLowerCase();
	const url = params.linkSlug.trim().toLowerCase();

	const bookingPage = await getBookingPageByUsername({ username });
	if (!bookingPage) throw error(404, 'Booking page not found.');
	if (bookingPage.user_id !== user.id) throw error(403, 'You do not have access to this page.');

	const bookingLink = await getBookingLinkByPageIdAndUrl({
		booking_page_id: bookingPage.id,
		url
	});
	if (!bookingLink) throw error(404, 'Booking link not found.');

	return { bookingPage, bookingLink };
};
