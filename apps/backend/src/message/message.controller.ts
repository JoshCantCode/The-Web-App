import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ChannelService } from 'src/channel/channel.service';
import { SendMessageDto } from '@the-web-app/types';

import { MessageService } from './message.service';

@Controller('message')
export class MessageController {

	constructor(
		private readonly messageService: MessageService,
		private readonly channelService: ChannelService
	) {}

	@Post('send')
	async sendMessage(@Body() body: SendMessageDto) {
		return await this.messageService.sendMessage(body);
	}

	@Get('/all/:channelId')
	async getMessagesForChannel(@Param('channelId') channelId: string) {
		return await this.channelService.getMessages(channelId);
	}

	@Delete('delete')
	async deleteMessage(@Body() body: { messageId: string }) {
		return await this.messageService.deleteMessage(body.messageId);
	}

	@Patch('edit')
	async editMessage(@Body() body: { messageId: string; content: string }) {
		console.log('Edit message request received:', body);
		const result = await this.messageService.editMessage(body.messageId, body.content);
		console.log('Edit message result:', result);
		return result;
	}

	@Get('/:messageId/history')
	async getMessageHistory(@Param('messageId') messageId: string) {
		return await this.messageService.getMessageHistory(messageId);
	}

	@Get('/:messageId/version/:version')
	async getMessageDiff(@Param('messageId') messageId: string, @Param('version') version: number) {
		return await this.messageService.getMessageVersion(messageId, version);
	}
}