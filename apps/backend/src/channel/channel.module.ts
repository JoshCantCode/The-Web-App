import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Category } from 'src/entities/category/Category.entity';
import { Channel } from 'src/entities/channel/Channel.entity';
import { FavouritedChannel } from 'src/entities/channel/FavouritedChannel.entity';
import { Server } from 'src/entities/server/Server.entity';
import { User } from 'src/entities/user/User.entity';

import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';

@Module({
	imports: [MikroOrmModule.forFeature([Category, Server, Channel, User, FavouritedChannel])],
	controllers: [ChannelController],
	providers: [ChannelService],
	exports: [ChannelService],
})
export class ChannelModule {}