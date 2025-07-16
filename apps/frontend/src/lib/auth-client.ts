import { customSessionClient } from 'better-auth/client/plugins';
import {
	createAuthClient,
} from 'better-auth/react';

import type { auth } from './auth';

const authClient = createAuthClient({
	baseURL: 'http://localhost:3000',
	plugins: [
		customSessionClient<typeof auth>(),
	],
	fetchOptions: {
		credentials: 'include',
	},

});

export const {
	signIn,
	signOut,
	signUp,
	useSession,
} = authClient;