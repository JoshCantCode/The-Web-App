import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { SendMessageDto } from '@the-web-app/types';
import { Channel } from 'src/entities/channel/Channel.entity';
import { Message } from 'src/entities/message/Message.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MessageService {

	private readonly logger = new Logger(MessageService.name);

	constructor(
		private readonly em: EntityManager,
        @InjectRepository(Channel) private readonly channelRepository: EntityRepository<Channel>,
		@InjectRepository(Message) private readonly messageRepository: EntityRepository<Message>,
		private readonly userService: UserService
	) {}

	async sendMessage(body: SendMessageDto) {
		this.logger.log(`Sending message: ${JSON.stringify(body)}`);
		const channel = await this.channelRepository.findOne({ id: body.channelId }, {
			populate: ['category', 'server'],
		});

		if (!channel) {
			this.logger.error(`Channel with ID: ${body.channelId} not found`);

			return {
				status: 404,
				message: 'Channel not found',
			};
		}

		this.logger.log(`Found channel: ${JSON.stringify(channel)}`);

		const server = channel.server;
		this.logger.log(`Server for channel: ${JSON.stringify(server)}`);
		if (!server) {
			this.logger.error(`Server for channel with ID: ${body.channelId} not found`);

			return {
				status: 404,
				message: 'Server not found',
			};
		}
		const { user } = await this.userService.getUser({
			id: body.authorId,
		});

		if (!user) {
			this.logger.error(`User with ID: ${body.authorId} not found`);

			return {
				status: 404,
				message: 'User not found',
			};
		}
		this.logger.log(`User found: ${JSON.stringify(user)}`);

		const message = new Message();
		message.content = body.content;
		message.channel = channel;
		message.author = user;
		message.id = `${server.id}-${Date.now()}`;

		console.log('Creating message with ID:', message.id);

		await this.em.persistAndFlush(message);

		console.log('Message after persistAndFlush:', JSON.stringify(message, null, 2));

		this.logger.log(`Message sent successfully: ${JSON.stringify(message)}`);

		return {
			status: 200,
			message: 'Message sent successfully',
			body: message,
		};
	}

	async deleteMessage(messageId: string) {
		const message = await this.messageRepository.findOne({ id: messageId });

		this.logger.log(`Deleting message with ID: ${messageId}`);

		if (!message) {
			this.logger.error(`Message with ID: ${messageId} not found`);

			return {
				status: 404,
				message: 'Message not found',
			};
		}

		this.logger.log(`Found message: ${JSON.stringify(message)}`);

		await this.em.removeAndFlush(message);

		return {
			status: 200,
			message: 'Message deleted successfully',
		};
	}

	async editMessage(messageId: string, newContent: string) {
		const message = await this.messageRepository.findOne({ id: messageId });

		this.logger.log(`Editing message with ID: ${messageId} to new content: ${newContent}`);

		if (!message) {
			this.logger.error(`Message with ID: ${messageId} not found`);

			return {
				status: 404,
				message: 'Message not found',
			};
		}

		this.logger.log(`Found message: ${JSON.stringify(message)}`);
		this.logger.log(`New content: ${newContent}`);
		message.content = newContent;

		const editedMetadata = message.editedMetadata;

		editedMetadata.push({
			version: editedMetadata.length + 1,
			editedBy: message.author,
			editedAt: new Date(),
			editedContent: newContent,
		});

		await this.em.persistAndFlush(message);

		return {
			status: 200,
			message: 'Message edited successfully',
			body: message,
		};
	}

	async getMessagesForChannel(channelId: string) {}


	async getMessageHistory(messageId: string) {
		const message = await this.messageRepository.findOne({ id: messageId });

		if (!message) {
			this.logger.error(`Message with ID: ${messageId} not found`);

			return {
				status: 404,
				message: 'Message not found',
			};
		}

		const history = message.editedMetadata;

		return {
			status: 200,
			message: 'Message history retrieved successfully',
			body: history,
		};
	}

	async getMessageVersion(messageId: string, version: number) {
		const message = await this.messageRepository.findOne({ id: messageId });

		if (!message) {
			this.logger.error(`Message with ID: ${messageId} not found`);

			return {
				status: 404,
				message: 'Message not found',
			};
		}

		const metadata = message.editedMetadata;
		const messageVersion = metadata.find((metadata) => metadata.version === version);

		if (!messageVersion) {
			this.logger.error(`Message version with ID: ${messageId} and version: ${version} not found`);

			return {
				body: message,
				status: 404,
				message: 'Message version not found',
			};
		}

		return {
			status: 200,
			message: 'Message version retrieved successfully',
			body: messageVersion,
		};
	} 
}