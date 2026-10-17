import {
	generateRefreshToken,
	hashToken,
	signAccessToken,
	verifyAccessToken
} from '$lib/server/functions/auth.js';
import {
	REFRESH_TTL_MS,
	type CreateSessionInput,
	type RefreshResult,
	type SessionTokens,
	type SignUpInput,
	type SignUpResult
} from '$lib/utils/constant.js';
import { eq, sql } from 'drizzle-orm';
import { db } from '../index.ts';
import { refresh_token_table, users_table } from '../schema.ts';
import { randomUUID } from 'node:crypto';

export async function refreshSession(rawRefreshToken: string): Promise<RefreshResult> {
	const tokenHash = hashToken(rawRefreshToken);

	return db.transaction(async (tx) => {
		// Lock the row so concurrent refreshes serialize.
		const rows = await tx.execute(sql`
      SELECT id, user_id, family_id, expires_at, revoked_at
      FROM refresh_tokens
      WHERE token_hash = ${tokenHash}
      FOR UPDATE
    `);

		const stored = rows[0] as
			| {
					id: string;
					user_id: string;
					family_id: string;
					expires_at: Date;
					revoked_at: Date | null;
			  }
			| undefined;

		if (!stored) return { ok: false, reason: 'not_found' };

		// Reuse detected: this token was already rotated (or explicitly revoked).
		// Nuke the whole family.
		if (stored.revoked_at) {
			await tx
				.update(refresh_token_table)
				.set({ revoked_at: new Date() })
				.where(eq(refresh_token_table.family_id, stored.family_id));
			return { ok: false, reason: 'reused' };
		}
		const expiresAt = new Date(stored.expires_at).getTime();

		if (expiresAt < Date.now()) {
			return { ok: false, reason: 'expired' };
		}

		const [user] = await tx
			.select({ id: users_table.id, email: users_table.email })
			.from(users_table)
			.where(eq(users_table.id, stored.user_id))
			.limit(1);

		if (!user) return { ok: false, reason: 'no_user' };

		// Rotate
		const newRawRefreshToken = generateRefreshToken();
		const newHash = hashToken(newRawRefreshToken);
		const newExpiresAt = new Date(Date.now() + REFRESH_TTL_MS);

		await tx
			.update(refresh_token_table)
			.set({ revoked_at: new Date(), replaced_by: newHash })
			.where(eq(refresh_token_table.id, stored.id));

		await tx.insert(refresh_token_table).values({
			token_hash: newHash,
			user_id: user.id,
			family_id: stored.family_id, // ← SAME family
			expires_at: newExpiresAt
		});

		// Build access token — no need to re-verify what you just signed.
		const accessToken = await signAccessToken({ sub: user.id, email: user.email });
		const payload = await verifyAccessToken(accessToken);
		if (!payload) return { ok: false, reason: 'no_user' };

		return { ok: true, accessToken, refreshToken: newRawRefreshToken, payload };
	});
}

export async function createSession(input: CreateSessionInput): Promise<SessionTokens> {
	const rawRefresh = generateRefreshToken();
	const tokenHash = hashToken(rawRefresh);
	const familyId = randomUUID(); // ← new family per login
	const expiresAt = new Date(Date.now() + REFRESH_TTL_MS);

	await db.insert(refresh_token_table).values({
		token_hash: tokenHash,
		user_id: input.userId,
		family_id: familyId,
		expires_at: expiresAt,
		user_agent: input.userAgent ?? null,
		ip: input.ip ?? null
		// created_at defaults to now()
		// revoked_at stays null
	});

	const accessToken = await signAccessToken({
		sub: input.userId,
		email: input.email
	});

	return { accessToken, refreshToken: rawRefresh };
}

export async function signUpWithSession(input: SignUpInput): Promise<SignUpResult> {
	return db.transaction(async (tx) => {
		// 1) create user

		const [newUser] = await tx
			.insert(users_table)
			.values({
				id: randomUUID(),
				name: input.name,
				email: input.email,
				email_verified: false,
				source: input.source,
				password_hash: input.password_hash
			})
			.returning();

		// 2) create session row (new family per signup)

		const newRawRefreshToken = generateRefreshToken();
		const newHash = hashToken(newRawRefreshToken);
		const familyId = randomUUID(); // ← new family per login
		const expiresAt = new Date(Date.now() + REFRESH_TTL_MS);

		await tx.insert(refresh_token_table).values({
			token_hash: newHash,
			user_id: newUser.id,
			family_id: familyId,
			expires_at: expiresAt,
			user_agent: input.userAgent ?? null,
			ip: input.ip ?? null
			// created_at defaults to now()
			// revoked_at stays null
		});

		// 3) sign access token
		const accessToken = await signAccessToken({
			sub: newUser.id,
			email: newUser.email
		});

		return {
			user: { id: newUser.id, email: newUser.email, name: newUser.name },
			accessToken,
			refreshToken: newRawRefreshToken
		};
	});
}
