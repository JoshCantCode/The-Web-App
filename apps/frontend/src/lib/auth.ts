import { betterAuth } from 'better-auth';
import { NeonDialect } from 'kysely-neon';
import { customSession } from 'better-auth/plugins';
import { getFavouritedChannels, getUserServers } from '@/api/server';

const dialect = new NeonDialect({
	connectionString: process.env.DATABASE_URL
});

export const auth = betterAuth({
	plugins: [
		customSession(async (session) => {
			const servers = await getUserServers(session.user.id);
			const ownedServer = servers?.find((server) => server.owner?.id === session.user.id);
			const favouritedChannels = await getFavouritedChannels(session.user.id);

			return {
				user: {
					...session.user,
					servers,
					ownedServer: ownedServer,
					messages: [], // Im gonna see if I can remove this in the backend later on
					favouritedChannels: favouritedChannels,
					password: '' // Password is never shared with the client

				},
				session: {
					...session.session,
				},
			};
		}),
	],
	baseURL: 'http://localhost:3000',
	database: dialect,

	user: {
		modelName: 'users'
	},

	account: {
		modelName: 'accounts'
	},


	
	session: {
		modelName: 'sessions',
		cookieCache: {
			maxAge: 60 * 60 * 24 * 7,
			enabled: true,
		},
		cookieOptions: {
			sameSite: 'None',
			secure: true,
		},
	},

	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		google: {
			clientId: '',
			clientSecret: '',
		},
		github: {
			clientId: '',
			clientSecret: '',
		},

	},

});