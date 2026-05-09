import { buildClerkProps } from 'svelte-clerk/server';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const auth = locals.auth();

	if (!auth.userId && url.pathname !== '/sign-in') {
		throw redirect(303, '/sign-in');
	}

	return {
		...buildClerkProps(auth)
	};
};
