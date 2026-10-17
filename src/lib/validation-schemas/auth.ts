import z from 'zod';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type UserInfoInput = z.infer<typeof userCredSchema>;

export type PasswordRuleCode = 'MIN_LENGTH' | 'MISSING_NUMBER' | 'MISSING_SPECIAL' | 'WHITESPACE';
export const nameSchema = z
	.string('Please enter a name')
	.trim() // optional: strip whitespace before validating
	.min(3, 'Name has to be at least 3 characters')
	.refine((val) => val === val.trim(), {
		message: 'Name cannot have leading or trailing whitespace'
	});

export const emailSchema = z
	.email('Please enter a valid email address')
	.min(1, 'Email is reqired')
	.regex(emailRegex, 'Invalid Email');
export const passwordSchema = z.string().superRefine((val, ctx) => {
	const rules: { code: PasswordRuleCode; ok: boolean; message: string }[] = [
		{
			code: 'MIN_LENGTH',
			ok: val.length >= 8,
			message: 'Password must be at least 8 characters long'
		},
		{
			code: 'MISSING_NUMBER',
			ok: /[0-9]/.test(val),
			message: 'Password must contain at least one number'
		},
		{
			code: 'MISSING_SPECIAL',
			ok: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(val),
			message: 'Password must contain at least one special character'
		},
		{
			code: 'WHITESPACE',
			ok: val === val.trim(),
			message: 'Password cannot have leading or trailing whitespace'
		}
	];

	for (const r of rules) {
		if (!r.ok) {
			ctx.addIssue({
				code: 'custom',
				message: r.message,
				params: { code: r.code } // ← your tag
			});
		}
	}
});

export const userCredSchema = z.object({
	name: nameSchema,
	email: emailSchema,
	password: passwordSchema
});

export const signInSchema = z.object({
	email: emailSchema,
	password: passwordSchema
});
