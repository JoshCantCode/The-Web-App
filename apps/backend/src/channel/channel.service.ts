import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { CreateChannelDto, FavouriteChannelDto } from '@the-web-app/types';
import { Category } from 'src/entities/category/Category.entity';
import { Channel } from 'src/entities/channel/Channel.entity';
import { FavouritedChannel } from 'src/entities/channel/FavouritedChannel.entity';
import { Server } from 'src/entities/server/Server.entity';
import { User } from 'src/entities/user/User.entity';
import { generateId } from 'src/utils/generator';

@Injectable()
export class ChannelService {

	constructor(
        @InjectRepository(Server) private readonly serverRepository: EntityRepository<Server>,
        @InjectRepository(Category) private readonly categoryRepository: EntityRepository<Category>,
        @InjectRepository(Channel) private readonly channelRepository: EntityRepository<Channel>,
		@InjectRepository(User) private readonly userRepository: EntityRepository<User>,
		@InjectRepository(FavouritedChannel) private readonly favouritedChannelRepository: EntityRepository<FavouritedChannel>,
		private readonly em: EntityManager
	) {}

	async createChannel(body: CreateChannelDto) {
		const category = await this.categoryRepository.findOne({ id: body.categoryId });
		if (!category) {
			return {
				status: 404,
				message: 'Category not found',
				channel: null,
			};
		}
		const server = await this.serverRepository.findOne({ id: body.serverId });

		if (!server) {
			return {
				status: 404,
				message: 'Server not found',
				channel: null,
			};
		}

		const channel = new Channel();
		channel.id = `$${server.id}-${generateId(12)}`;
		channel.name = body.name;
		channel.description = body.description;
		channel.category = category;
		channel.server = server;

		await this.em.persistAndFlush(channel);

		return {
			status: 200,
			message: `Channel ${channel.name} created successfully`,
			channel,
		};
	}

	async getMessages(channelId: string) {
		const channel = await this.channelRepository.findOne({ id: channelId }, {
			populate: ['messages.author'],
		});

		if (!channel) {
			return {
				status: 404,
				message: 'Channel not found',
				messages: null,
			};
		}

		console.log('Messages from channel:', JSON.stringify(channel.messages, null, 2));

		return {
			status: 200,
			message: 'Messages found',
			messages: channel.messages,
		};
	}

	async favouriteChannel(body: FavouriteChannelDto) {
		const channel = await this.channelRepository.findOne({ id: body.channelId }, {
			populate: ['server', 'favouritedBy'],
		});
		if (!channel) {
			return {
				status: 404,
				message: 'Channel not found',
				channel: null,
			};
		}

		const server = await this.serverRepository.findOne({ id: body.serverId }, { populate: ['channels'] });
		if (!server) {
			return {
				status: 404,
				message: 'Server not found',
				channel: null,
			};
		}

		const user = await this.userRepository.findOne({ id: body.userId }, {
			populate: ['favouritedChannels'],
		});

		if (!user) {
			return {
				status: 404,
				message: 'User not found',
				channel: null,
			};
		}

		const usersFavouritedChannels = user.favouritedChannels;

		const isFavourited = await this.favouritedChannelRepository.findOne({ user: user.id, channel: channel.id, server: server.id });
		if (isFavourited) {
			return {
				status: 400,
				message: 'Channel already favourited',
				channel: null,
			};
		}

		const serverSortedFavouritedChannels = usersFavouritedChannels.filter(favouritedChannel => favouritedChannel.server.id === server.id);

		if (serverSortedFavouritedChannels.length >= 5) {
			return {
				status: 400,
				message: 'You can only favourite 5 channels per server',
				channel: null,
			};
		}

		const favouritedChannel = new FavouritedChannel();
		favouritedChannel.id = `$${channel.id}-${user.id}`;

		favouritedChannel.channel = channel;
		favouritedChannel.user = user;
		favouritedChannel.server = server;

		await this.em.persistAndFlush(favouritedChannel);
		channel.favouritedBy.add(favouritedChannel);
		user.favouritedChannels.add(favouritedChannel);

		await this.em.persistAndFlush([channel, user]);

		return {
			status: 200,
			message: `Channel ${channel.name} favourited successfully`,
			body: favouritedChannel,
		};
	}

	async unFavouriteChannel(body: FavouriteChannelDto) {
		const favouritedChannel = await this.favouritedChannelRepository.findOne({
			user: body.userId,
			channel: body.channelId,
			server: body.serverId,
		}, {
			populate: ['channel', 'user', 'server'],
		});

		if (!favouritedChannel) {
			return {
				status: 404,
				message: 'Favourited channel not found',
				channel: null,
			};
		}

		const channel = await this.channelRepository.findOne({ id: favouritedChannel.channel.id }, {
			populate: ['favouritedBy'],
		});

		if (!channel) {
			return {
				status: 404,
				message: 'Channel not found',
				channel: null,
			};
		}

		const server = await this.serverRepository.findOne({ id: favouritedChannel.server.id }, { populate: ['channels'] });

		if (!server) {
			return {
				status: 404,
				message: 'Server not found',
				channel: null,
			};
		}

		const user = await this.userRepository.findOne({ id: favouritedChannel.user.id }, {
			populate: ['favouritedChannels'],
		});

		if (!user) {
			return {
				status: 404,
				message: 'User not found',
				channel: null,
			};
		}

		channel.favouritedBy.remove(favouritedChannel);
		user.favouritedChannels.remove(favouritedChannel);
		await this.em.removeAndFlush(favouritedChannel);
		await this.em.persistAndFlush([channel, user]);

		return {
			status: 200,
			message: `Channel ${channel.name} unfavourited successfully`,
			body: favouritedChannel,
		};
	}

	async deleteChannel(channelId: string) {
		const channel = await this.channelRepository.findOne({ id: channelId }, {
			populate: ['server', 'messages'],
		});

		if (!channel) {
			return {
				status: 404,
				message: 'Channel not found',
				channel: null,
			};
		}

		const category = await this.categoryRepository.findOne({ id: channel.category.id }, {
			populate: ['channels'],
		});

		if (!category) {
			return {
				status: 404,
				message: 'Category not found',
				channel: null,
			};
		}

		await this.em.removeAndFlush(channel.messages);
		// Remove the channel
		category.channels.remove(channel);
		await this.em.persistAndFlush(category);
		await this.em.removeAndFlush(channel);

		return {
			status: 200,
			message: `Channel ${channel.name} deleted successfully`,
		};
	}

}