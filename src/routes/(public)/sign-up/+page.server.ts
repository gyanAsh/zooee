import { userCredSchema } from '$lib/validation-schemas/auth.js';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types.js';
import { getUserByEmail } from '$lib/server/db/queries/user.js';
import { hashPassword, setAuthCookies } from '$lib/server/functions/auth.js';
import { signUpWithSession } from '$lib/server/db/queries/auth.js';
import { USER_AUTH_SOURCE, type SessionTokens } from '$lib/utils/constant.js';
export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const result = userCredSchema.safeParse({
			name: formData.get('name'),
			email: formData.get('email'),
			password: formData.get('password')
		});

		if (!result.success) {
			return fail(401, { success: false, message: 'Invalid name, email or password.' });
		}

		// Fast pre-check for nicer UX. NOT authoritative — see catch block.
		const existing = await getUserByEmail({ email: result.data.email });
		if (existing?.email) {
			return fail(409, { success: false, message: 'Email already in use.' });
		}

		const hashedPassword = await hashPassword(result.data.password);

		let session: SessionTokens;
		try {
			session = await signUpWithSession({
				name: result.data.name,
				email: result.data.email,
				password_hash: hashedPassword,
				source: USER_AUTH_SOURCE.password,
				userAgent: request.headers.get('user-agent') ?? null
			});
		} catch (err) {
			// Unique violation on users.email → someone signed up in the meantime.
			console.log({ err });
			return fail(500, {
				success: false,
				message: 'Something went wrong. Try again after some time.'
			});
		}

		setAuthCookies(cookies, {
			accessToken: session.accessToken,
			refreshToken: session.refreshToken
		});

		throw redirect(303, '/dashboard');
	}
};
