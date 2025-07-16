import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository, FilterQuery } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@the-web-app/types';
import { User } from 'src/entities/user/User.entity';
import { ServerService } from 'src/server/server.service';

@Injectable()
export class UserService {

	constructor(
		private readonly em: EntityManager,
        @InjectRepository(User) private readonly userRepository: EntityRepository<User>,
        private readonly serverService: ServerService
	) {}

	async createUser(body: CreateUserDto) {
		// TODO: Check if user already exists

		const user = new User();
		user.name = body.username;
		user.email = body.email;

		await this.em.persistAndFlush(user);

		return user;
	}

	async deleteUser(userId: string) {}

	async getUser(details: FilterQuery<User>) {
		const user = await this.userRepository.findOne(details, { populate: ['servers.categories'] });
		if (!user) {
			return {
				status: 404,
				message: 'User not found',
				user: null,
			};
		}

		return {
			status: 200,
			message: 'User found',
			user,
		};
	}

	async getUserServers(userId: string) {
		const user = await this.userRepository.findOne({ id: userId });
		if (!user) {
			return {
				status: 404,
				message: 'User not found',
				servers: null,
			};
		}

		const servers = (await this.serverService.getAllServers()).servers;
		if (!servers) {
			return {
				status: 404,
				message: 'No servers found',
				servers: null,
			};
		}

		const userServers = servers.filter(server => server.members.contains(user));
		if (!userServers || userServers.length === 0) {
			return {
				status: 404,
				message: 'No servers found for user',
				servers: null,
			};
		}

		return {
			status: 200,
			message: 'User servers found',
			servers: userServers,
		};
	}

	async getFavouritedChannels(userId: string, serverId?: string) {
		const user = await this.userRepository.findOne({ id: userId }, { populate: ['favouritedChannels.*'] });
		if (!user) {
			return {
				status: 404,
				message: 'User not found',
				channels: null,
			};
		}

		const channels = user.favouritedChannels;

		if (!channels || channels.length === 0) {
			return {
				status: 404,
				message: 'No favourited channels found',
				channels: null,
			};
		}

		if (serverId) {
			const server = await this.serverService.getServer(serverId);
			if (!server) {
				return {
					status: 404,
					message: 'Server not found',
					channels: null,
				};
			}

			const serverChannels = channels.filter(channel => channel.server.id === serverId);
			if (!serverChannels || serverChannels.length === 0) {
				return {
					status: 404,
					message: 'No favourited channels found for server',
					channels: null,
				};
			}

			return {
				status: 200,
				message: 'Favourited channels found for server',
				channels: serverChannels,
			};
		}

		return {
			status: 200,
			message: 'Favourited channels found',
			channels,
		};
	}

	async updateUserProfile(userId: string, profileData: any) {}

}