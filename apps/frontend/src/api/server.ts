import { type CreateChannelDto, type CreateCategoryDto, type CreateServerDto, type Server, type Category, type Channel, type User, NotificationType } from '@the-web-app/types';
import api from '@/api/axios';
import sendNotification from "@the-web-app/notifications";

export async function getUserServers(userId: string) {
	const response = await api.get(`/user/${userId}/servers`);

	if (response.status !== 200) {
		return null;
	}

	return response.data.servers as Server[];
}

export async function createServer(server: CreateServerDto): Promise<Server | null> {
	const response = await api.post('/server/create', server, {
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (response.status !== 201) {
		return null;
	}

	return response.data.server as Server;
}

export async function deleteChannel(channelId: string) {
	const response = await api.delete(`/channel/delete`, {
		data: { channelId },
	})

	if (response.status !== 200) {
		console.error('Error deleting channel:', response.status, response.data);
		return null;
	}

	return response.data;
}

export async function getCategory(categoryId: string) {
	try {
		const response = await api.get(`/category/${categoryId}`);

		if (response.status !== 200 || !response.data.category) {
			console.error('Category not found, invalid response:', response.status);

			return null;
		};

		return response.data.category as Category;
	} catch (error) {
		console.error('Error fetching category:', error);

		return null;
	}
}

export async function getServerCategories(serverId: string) {
	const response = await api.get(`/category/server/${serverId}`);
	if (response.status !== 200) {
		return null;
	}

	return response.data.categories as Category[];
}

export async function createChannel(channel: CreateChannelDto) {
	const response = await api.post('/channel/create', channel);

	if (response.status !== 201) {
		return null;
	}

	return response.data.channel as Channel;
}

export async function createCategory(category: CreateCategoryDto) {
	const response = await api.post('/category/create', category);

	if (response.status !== 201) {
		return null;
	}

	return response.data.category as Category;
}

export async function getServer(serverId: string) {
	const response = await api.get(`/server/${serverId}`);

	if (response.status !== 200) {
		return null;
	}

	return response.data.server as Server;
}

export async function joinServer(serverId: string, userId: string) {
	const response = await api.post(`/server/${serverId}/join`, { userId });
	if (response.status !== 200) {
		return null;
	}

	return response.data.server as Server;
}

export async function favouriteChannel(channelId: string, userId: string, serverId: string) {
	const response = await api.post('/channel/favourite', { channelId, serverId, userId });
	if (response.data.status !== 200) {
		sendNotification({
			type: NotificationType.Error,
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			message: response.data.message,
		});

		return false;
	}

	return response.data.body as {
		channelId: string
		userId: string
		serverId: string
	};
}

export interface FavouritedChannel {
	id: string
	channel: Channel
	server: Server
	user: User
}

export async function getFavouritedChannels(userId: string, serverId?: string): Promise<FavouritedChannel[] | null> {
	try {
		const { data } = await api.get(`/user/${userId}/favourites`, {
			params: { serverId },
		});
		if (data.status === 200) {
			return data.channels;
		}

		return null;
	} catch (e) {
		console.error('Failed to fetch favourited channels', e);

		return null;
	}
}

export interface UnFavouriteChannelDto {
	channelId: string
	serverId: string
	userId: string
}

export async function unfavouriteChannel(fc: UnFavouriteChannelDto) {
	const response = await api.delete('/channel/unfavourite', { data: fc });

	if (response.status !== 200) {
		return null;
	}

	return response;
}


export async function editMessage(messageId: string, content: string) {
	try {
		console.log('Editing message:', { messageId, content });
		const response = await api.patch('/message/edit', { messageId, content });

		if (response.status !== 200) {
			console.error('Edit message failed with status:', response.status);
			return null;
		}

		console.log('Edit message successful:', response.data);
		return response.data;
	} catch (error) {
		console.error('Edit message error:', error);
		return null;
	}
}

export async function deleteMessage(messageId: string) {
	const response = await api.delete('/message/delete', { data: { messageId } });

	if (response.status !== 200) {
		return null;
	}

	return response.data;
}
