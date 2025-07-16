import { Body, Controller, Delete, Post } from "@nestjs/common";
import { ChannelService } from "src/channel/channel.service";
import { CreateChannelDto, FavouriteChannelDto } from "@the-web-app/types";

@Controller('channel')
export class ChannelController {
    constructor(
        private readonly channelService: ChannelService,
    ) {}

    @Post('create')
    async createChannel(@Body() body: CreateChannelDto) {
        return await this.channelService.createChannel(body);
    }

    @Post('favourite')
    async favouriteChannel(@Body() body: FavouriteChannelDto) {
        return await this.channelService.favouriteChannel(body);
    }

    @Delete('unfavourite')
    async unfavouriteChannel(@Body() body: FavouriteChannelDto) {
        return await this.channelService.unFavouriteChannel(body);
    }

    @Delete('delete')
    async deleteChannel(@Body() body: { channelId: string }) {
        return await this.channelService.deleteChannel(body.channelId);
    }
}