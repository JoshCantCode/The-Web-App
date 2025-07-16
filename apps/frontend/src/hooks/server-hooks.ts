import { Server } from '@the-web-app/types';
import { useQuery } from '@tanstack/react-query';

import { FavouritedChannel, getFavouritedChannels, getServer } from '@/api/server';

/**
 * Fetches favourited channels for a user (optionally filtered by server).
 * @param userId The user's ID
 * @param serverId (Optional) The server's ID to filter favourites
 */
export function useFavouritedChannels(userId: string | undefined, serverId?: string) {
	return useQuery<FavouritedChannel[] | null>(
		{
			queryKey: ['favourited-channels', userId, serverId],
			queryFn: () => getFavouritedChannels(userId!, serverId),
			enabled: !!userId,
			staleTime: 1000 * 60 * 60 * 24, // 24 hours
		}
	);
}

/**
 * Fetches a server by its ID.
 * @param serverId The server ID
 * @returns The server, or null if it doesn't exist
 */

export function useServer(serverId: string) {
	return useQuery<Server | null>({
		queryKey: ['server', serverId],
		queryFn: () => getServer(serverId),
		enabled: !!serverId,
	});
}