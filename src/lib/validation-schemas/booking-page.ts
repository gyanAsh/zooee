import { z } from 'zod';

// Usernames become public URLs, so reserve the route names you already own.
const RESERVED_USERNAMES = new Set([
	'sign-in',
	'sign-up',
	'dashboard',
	'my-page',
	'api',
	'demo',
	'admin',
	'support',
	'help'
]);

export const displayNameSchema = z
	.string('Please enter a display name')
	.trim()
	.min(1, 'Display name is required')
	.max(50, 'Display name must be 50 characters or fewer');

// trim + lowercase happen before the checks, so "  Zooee " becomes "zooee"
export const usernameSchema = z
	.string('Please enter a username')
	.trim()
	.toLowerCase()
	.min(3, 'Username must be at least 3 characters')
	.max(30, 'Username must be 30 characters or fewer')
	.regex(
		/^[a-z0-9](?:[a-z0-9_-]*[a-z0-9])?$/,
		'Use lowercase letters, numbers, - or _ (must start and end with a letter or number)'
	)
	.refine((value) => !RESERVED_USERNAMES.has(value), 'That username is reserved');

// Empty bio clears the column rather than storing ""
export const bioSchema = z
	.string()
	.trim()
	.max(160, 'Bio must be 160 characters or fewer')
	.transform((value) => (value.length === 0 ? null : value));

export const imageUrlSchema = z
	.string()
	.trim()
	.max(2048, 'URL is too long')
	.refine((value) => value === '' || /^https?:\/\//.test(value), 'Must be a valid http(s) URL')
	.transform((value) => (value === '' ? null : value));
