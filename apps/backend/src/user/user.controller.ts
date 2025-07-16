import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { CreateUserDto } from '@the-web-app/types';

import { UserService } from './user.service';

@Controller('user')
export class UserController {

	constructor(
		private readonly userService: UserService
	) {}

	@Post('create')
	async createUser(@Body() body: CreateUserDto) {
		return await this.userService.createUser(body);
	}

	

	@HttpCode(HttpStatus.OK)
	@Get(':id/servers')
	async getUserServers(@Param('id') id: string) {
		return await this.userService.getUserServers(id);
	}

	@HttpCode(HttpStatus.OK)
	@Get(':id')
	async getUser(@Param('id') id: string) {
		return await this.userService.getUser({ id });
	}

	@HttpCode(HttpStatus.OK)
	@Get(':userId/favourites')
	async getFavouritedChannels(@Param('userId') userId: string, @Query('serverId') serverId?: string) {
		return await this.userService.getFavouritedChannels(userId, serverId);
	}

}