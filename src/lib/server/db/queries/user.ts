import { db } from '../index.ts';
import { users_table } from '../schema.ts';
import { eq } from 'drizzle-orm';

export const getUserByEmail = async ({ email }: { email: string }) => {
	return db.query.users_table.findFirst({
		where: (users) => eq(users.email, email)
	});
};

export const verifyEmail = async ({ email }: { email: string }) => {
	const [user] = await db
		.update(users_table)
		.set({ email_verified: true })
		.where(eq(users_table.email, email))
		.returning();

	return user;
};

export const getUserById = async ({ id }: { id: string }) => {
	return db.query.users_table.findFirst({
		where: (users) => eq(users.id, id)
	});
};

// ------------------------UPDATE--------------------------
export const updateUserName = async ({ id, name }: { id: string; name: string }) => {
	const [user] = await db
		.update(users_table)
		.set({ name, updatedAt: new Date() })
		.where(eq(users_table.id, id))
		.returning();

	return user;
};
