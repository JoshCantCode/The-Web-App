import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { CreateServerDto } from '@the-web-app/types';
import { Category } from 'src/entities/category/Category.entity';
import { Channel } from 'src/entities/channel/Channel.entity';
import { Server } from 'src/entities/server/Server.entity';
import { User } from 'src/entities/user/User.entity';

@Injectable()
export class ServerService {

	constructor(
		private readonly em: EntityManager,
		@InjectRepository(Server) private readonly serverRepository: EntityRepository<Server>,
		@InjectRepository(User) private readonly userRepository: EntityRepository<User>
	) {

	}

	async createServer(body: CreateServerDto) {
		console.log(body)
		const server = new Server();

		server.name = body.name;
		server.description = body.description;

		const defaultTextChannel = new Channel();
		defaultTextChannel.name = 'General';
		defaultTextChannel.description = 'General discussion';

		const defaultCategory = new Category();
		defaultCategory.name = 'General';
		defaultCategory.description = 'General discussion';
		defaultCategory.setServer(server);
		defaultTextChannel.server = server;
		defaultCategory.addChannel(defaultTextChannel);

		const user = await this.userRepository.findOne({ id: body.ownerId });

		if (!user) {
			return {
				status: 404,
				message: 'User not found',
				server: null,
			};
		}

		server.setOwner(user);
		server.addMember(user);

		this.em.persist(user);
		this.em.persist(server);
		this.em.persist(defaultCategory);
		this.em.persist(defaultTextChannel);

		await this.em.flush();

		return {
			status: 200,
			message: 'Server created successfully',
			server,
		};
	}

	async getServer(id: string) {
		const server = await this.serverRepository.findOne({ id }, { populate: ['categories.channels', 'members'] });
		if (!server) {
			return {
				status: 404,
				message: 'Server not found',
				server: null,
			};
		}

		return {
			status: 200,
			message: 'Server found',
			server,
		};
	}

	async getAllServers() {
		const servers = await this.serverRepository.findAll({ populate: ['categories.channels', 'members'] });
		if (!servers) {
			return {
				status: 404,
				message: 'No servers found',
				servers: null,
			};
		}

		return {
			status: 200,
			message: 'Servers found',
			servers,
		};
	}

	async deleteServer(id: string) {
		const server = await this.serverRepository.findOne({ id });
		if (!server) {
			return {
				status: 404,
				message: 'Server not found',
				server: null,
			};
		}
		await this.em.removeAndFlush(server);

		return {
			status: 200,
			message: 'Server deleted successfully',
			server,
		};
	}

	async joinServer(serverId: string, userId: string) {
		const user = await this.userRepository.findOne({ id: userId }, { populate: ['servers'] });
		if (!user) {
			return {
				status: 404,
				message: 'User not found',
				user: null,
			};
		}

		const server = await this.serverRepository.findOne({ id: serverId }, {
			populate: ['members'],
		});
		if (!server) {
			return {
				status: 404,
				message: 'Server not found',
				user,
				server: null,
			};
		}

		if (user.servers.contains(server)) {
			return {
				status: 401,
				message: 'User is already in the server',
				user,
				server,
			};
		}

		server.addMember(user);

		await this.em.persistAndFlush(user);
		await this.em.persistAndFlush(server);

		return {
			status: 200,
			message: 'User joined server successfully',
			user,
			server,
		};
	}

}