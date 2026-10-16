import type { Cookies } from '@sveltejs/kit';
import {
	randomBytes,
	scrypt as _scrypt,
	timingSafeEqual,
	createHash,
	type ScryptOptions
} from 'node:crypto';
import { promisify } from 'node:util';
import { env } from '$env/dynamic/private';
import { jwtVerify, SignJWT, type JWTPayload } from 'jose';
import {
	ACCESS_TTL_MS,
	COOKIE_KEYS,
	REFRESH_TTL_MS,
	type AccessTokenClaims,
	type AccessTokenPayload
} from '$lib/utils/constant.js';

const scrypt = promisify(_scrypt) as (
	password: string | Buffer,
	salt: string | Buffer,
	keylen: number,
	options?: ScryptOptions
) => Promise<Buffer>;

interface Tokens {
	accessToken: string;
	refreshToken: string;
}

export function setAuthCookies(cookies: Cookies, { accessToken, refreshToken }: Tokens) {
	const base = {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production'
	} as const;
	cookies.set(COOKIE_KEYS.ACCESS_COOKIE, accessToken, { ...base, maxAge: ACCESS_TTL_MS / 1000 });
	cookies.set(COOKIE_KEYS.REFRESH_COOKIE, refreshToken, { ...base, maxAge: REFRESH_TTL_MS / 1000 });
}

export function clearAuthCookies(cookies: Cookies) {
	cookies.delete(COOKIE_KEYS.ACCESS_COOKIE, { path: '/' });
	cookies.delete(COOKIE_KEYS.REFRESH_COOKIE, { path: '/' });
}

const N = 131072,
	r = 8,
	p = 1;
const SALT_LENGTH = 16;
const KEY_LENGTH = 64;
const MAXMEM = 256 * N * r;

const opts = { N, r, p, maxmem: MAXMEM };
/** Returns `scrypt$<salt>$<key>`, safe to store in `users_table.password_hash`. */
export async function hashPassword(password: string): Promise<string> {
	const salt = randomBytes(SALT_LENGTH);
	const key = await scrypt(password, salt, KEY_LENGTH, opts);
	return `scrypt$${N}$${r}$${p}$${salt.toString('hex')}$${key.toString('hex')}`;
}
/** Constant-time comparison, so the action never returns early on a bad password. */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
	const parts = stored.split('$');
	if (parts.length !== 6 || parts[0] !== 'scrypt') return false;

	const [, nStr, rStr, pStr, saltHex, keyHex] = parts;
	const storedKey = Buffer.from(keyHex, 'hex');

	try {
		const candidate = await scrypt(password, Buffer.from(saltHex, 'hex'), storedKey.length, {
			N: Number(nStr),
			r: Number(rStr),
			p: Number(pStr),
			maxmem: MAXMEM
		});
		if (candidate.length !== storedKey.length) return false;
		return timingSafeEqual(candidate, storedKey);
	} catch {
		return false;
	}
}

function getAccessTokenSecret(): Buffer {
	const secret = env.ACCESS_TOKEN_SECRET;
	if (!secret) throw new Error('ACCESS_TOKEN_SECRET is not set');

	const key = Buffer.from(secret, 'base64'); // or 'utf8' if it's a raw string

	if (key.length < 32) {
		throw new Error('ACCESS_TOKEN_SECRET must be at least 32 bytes');
	}

	return key;
}
function getJWTIssSecret(): string {
	const secret = env.JWT_ISSUER;
	if (!secret) {
		throw new Error('JWT_ISSUER is not set');
	}

	return secret;
}
function getJWTAudSecret(): string {
	const secret = env.JWT_AUDIENCE;
	if (!secret) {
		throw new Error('JWT_AUDIENCE is not set');
	}

	return secret;
}

/** Creates an HS256 JWT that expires after the given number of seconds. */
export async function signAccessToken(
	payload: AccessTokenPayload,
	expiresInSeconds = 15 * 60
): Promise<string> {
	return await new SignJWT(payload as JWTPayload)
		.setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
		.setIssuedAt()
		.setExpirationTime(`${expiresInSeconds}s`)
		.setIssuer(getJWTIssSecret())
		.setAudience(getJWTAudSecret())
		.sign(getAccessTokenSecret());
}

/** Verifies an HS256 JWT and returns its claims, or `null` if invalid or expired. */
export async function verifyAccessToken(token: string): Promise<AccessTokenClaims | null> {
	try {
		const secret = getAccessTokenSecret();
		const { payload } = await jwtVerify(token, secret, {
			algorithms: ['HS256'],
			issuer: getJWTIssSecret(),
			audience: getJWTAudSecret(),
			clockTolerance: 30
		});
		return payload as AccessTokenClaims;
	} catch {
		return null;
	}
}

/** 256-bit opaque refresh token, URL-safe. */
export function generateRefreshToken(): string {
	return randomBytes(32).toString('base64url'); // 43 chars ✔
}

/** SHA-256 → base64url. */
export function hashToken(token: string): string {
	return createHash('sha256').update(token, 'utf8').digest('base64url');
}

/** Constant-time compare for base64url strings. */
export function safeEqual(a: string, b: string): boolean {
	const aBuf = Buffer.from(a, 'utf8');
	const bBuf = Buffer.from(b, 'utf8');
	if (aBuf.length !== bBuf.length) return false;
	return timingSafeEqual(aBuf, bBuf);
}
