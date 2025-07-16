import { create } from 'zustand';
import { getServer, getUserServers } from '@/api/server';
import { Channel, Server } from '@the-web-app/types';
import { useSession } from '@/lib/auth-client';
import { useQueryClient, useQuery } from '@tanstack/react-query';

export interface ClientState {
	server: Server | null;
	channel: Channel | null;
	servers: Server[];
	isLoadingServers: boolean;
	setServer: (server: Server | null) => void;
	setChannel: (channel: Channel | null) => void;
	refreshServer: () => void;
	refetchServers: () => void;
}

export const useClientState = create<ClientState>((set, get) => ({
	server: null,
	channel: null,
	servers: [],
	isLoadingServers: false,

	setServer: (server) => set({ server, channel: null }),
	setChannel: (channel) => set({ channel }),

	refreshServer: async () => {
		const server = get().server;
		if (server) {
			const fresh = await getServer(server.id);
			set({ server: fresh });
		}
	},

	refetchServers: async () => {
		const session = getSessionFromReactQuery();
		if (!session?.user) return;

		set({ isLoadingServers: true });
		try {
			const servers = await getUserServers(session.user.id);
			set({ servers: servers ?? [] });
		} finally {
			set({ isLoadingServers: false });
		}
	},
}));


let _session: Awaited<ReturnType<typeof useSession>> | null = null;
function getSessionFromReactQuery() {
	return _session?.data;
}

export function useClientStateSync() {
	const queryClient = useQueryClient();
	const session = useSession();
	_session = session;

	const user = session?.data?.user;
	const set = useClientState.setState;

	useQuery({
		queryKey: ['servers', user?.id],
		queryFn: async () => {
		  const servers = await getUserServers(user!.id);
		  set({ servers: servers ?? [] });
		  return servers;
		},
		enabled: !!user,
	  });

	const server = useClientState.getState().server;
	useQuery({
		queryKey: ['server', server?.id],
		queryFn: async () => {
		  const fresh = await getServer(server!.id);
		  useClientState.setState({ server: fresh });
		  return fresh;
		},
		enabled: !!server,
	  });
}