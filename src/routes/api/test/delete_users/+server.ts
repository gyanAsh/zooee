import { db } from '$lib/server/db/index.js';
import { users_table } from '$lib/server/db/schema.js';

export async function DELETE() {
	try {
		await db.delete(users_table);
		return Response.json({ message: 'All users deleted' });
	} catch (error: unknown) {
		return Response.json({ err: 'Failed to delete users', error }, { status: 500 });
	}
}
