import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { CreateServerDto } from '@the-web-app/types';
import { ServerService } from './server.service';

@Controller('server')
export class ServerController {

	constructor(
		private readonly serverService: ServerService
	) {}

	@Post('create')
	async createServer(@Body() body: CreateServerDto) {
		console.log("controller", body)
		return await this.serverService.createServer(body);
	}

	@Get(':id')
	async getServer(@Param('id') id: string) {
		return await this.serverService.getServer(id);
	}

	@Post(':id/join')
	async joinServer(@Param('id') id: string, @Body() body: { userId: string }) {
		return await this.serverService.joinServer(id, body.userId);
	}

}