/* eslint-disable no-console */
import { Logger } from '@nestjs/common';
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatEvents, SendMessageDto } from '@the-web-app/types';

import { ChannelService } from '../channel/channel.service';
import { MessageService } from '../message/message.service';

@WebSocketGateway({
	namespace: /^\/server-.+$/,
	cors: {
		origin: '*',
	},
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

	private readonly logger = new Logger(ChatGateway.name);

	constructor(
		private readonly messageService: MessageService,
		private readonly channelService: ChannelService
	) {}

	@WebSocketServer()
	server: Server;

	handleConnection(client: Socket) {
		this.logger.log(`Client connected: ${client.id} to namespace ${client.nsp.name}`);
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
	}
	1

	@SubscribeMessage(ChatEvents.JOIN_CHANNEL)
	async handleJoinChannel(client: Socket, channelId: string) {
		try {
			client.join(channelId);
			this.logger.log(`Client ${client.id} joined channel: ${channelId}`);
		} catch (error) {
			this.logger.error(`Join channel error: ${error.message}`);
			throw new WsException('Failed to join channel');
		}
	}

	@SubscribeMessage(ChatEvents.LEAVE_CHANNEL)
	async handleLeaveChannel(client: Socket, channelId: string) {
		try {
			client.leave(channelId);
			this.logger.log(`Client ${client.id} left channel: ${channelId}`);
		} catch (error) {
			this.logger.error(`Leave channel error: ${error.message}`);
			throw new WsException('Failed to leave channel');
		}
	}

	@SubscribeMessage(ChatEvents.GET_MESSAGES)
	async handleGetMessages(client: Socket, channelId: string) {
		try {
			const { messages } = await this.channelService.getMessages(channelId);
			console.log('Sending messages to client:', JSON.stringify(messages, null, 2));
			client.emit(ChatEvents.MESSAGE_HISTORY, messages);
			this.logger.log(`Client ${client.id} requested messages for channel: ${channelId}. Amount: ${messages.length}`);
		} catch (error) {
			this.logger.error(`Get messages error: ${error.message}`);
			client.emit(ChatEvents.ERROR, 'Failed to fetch messages');
		}
	}

	@SubscribeMessage(ChatEvents.SEND_MESSAGE)
	async handleMessage(client: Socket, message: SendMessageDto) {
		try {
			const msg = await this.messageService.sendMessage(message);

			if (msg.status !== 200) {
				this.logger.warn(`Client ${client.id} failed to send message to ${message.channelId}`);
				client.emit(ChatEvents.ERROR, 'Failed to save message');

				return;
			}

			this.logger.log(`Client ${client.id} sent message to channel ${message.channelId}`);
			this.server.to(message.channelId).emit(ChatEvents.MESSAGE, msg.body);
		} catch (error) {
			this.logger.error(`Message handling error: ${error.message}`);
			client.emit(ChatEvents.ERROR, 'Failed to send message');
		}
	}

}
