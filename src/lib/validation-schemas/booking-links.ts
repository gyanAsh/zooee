import { z } from 'zod';

export const bookingLinkNameSchema = z
	.string('Please enter a name')
	.trim()
	.min(1, 'Name is required')
	.max(100, 'Name must be 100 characters or fewer');

export const bookingLinkDescriptionSchema = z
	.string()
	.trim()
	.max(500, 'Description must be 500 characters or fewer')
	.transform((value) => (value.length === 0 ? null : value));

export const bookingLinkDurationSchema = z.coerce
	.number()
	.int('Duration must be a whole number')
	.min(5, 'Duration must be at least 5 minutes')
	.max(480, 'Duration must be 480 minutes or fewer')
	.refine((value) => value % 5 === 0, 'Duration must be in 5-minute increments');
