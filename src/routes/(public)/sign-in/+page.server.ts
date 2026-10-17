import { signInSchema } from '$lib/validation-schemas/auth.js';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types.js';
import { getUserByEmail } from '$lib/server/db/queries/user.js';
import { setAuthCookies, verifyPassword } from '$lib/server/functions/auth.js';
import { createSession } from '$lib/server/db/queries/auth.js';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const result = signInSchema.safeParse({
			email: formData.get('email'),
			password: formData.get('password')
		});
		if (!result.success) {
			return fail(401, { success: false, message: 'Invalid email or password.' });
		}
		const user = await getUserByEmail({ email: result.data.email });
		// Single generic error for every failure mode — no enumeration.
		const GENERIC = { success: false, message: 'Invalid email or password.' } as const;
		if (!user || !user.password_hash) return fail(401, GENERIC);

		const ok = await verifyPassword(result.data.password, user.password_hash);
		if (!ok) return fail(401, GENERIC);

		const { accessToken, refreshToken } = await createSession({
			userId: user.id,
			email: user.email,
			userAgent: request.headers.get('user-agent') ?? null
		});

		setAuthCookies(cookies, { accessToken, refreshToken });
		throw redirect(303, '/dashboard');

		// return {
		// 	success: true,
		// 	name: user.name,
		// 	message: 'Logging in.'
		// };
	}
};
