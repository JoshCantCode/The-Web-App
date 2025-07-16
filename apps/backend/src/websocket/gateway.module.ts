import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ChannelModule } from 'src/channel/channel.module';
import { Category } from 'src/entities/category/Category.entity';
import { Channel } from 'src/entities/channel/Channel.entity';
import { FavouritedChannel } from 'src/entities/channel/FavouritedChannel.entity';
import { Server } from 'src/entities/server/Server.entity';
import { User } from 'src/entities/user/User.entity';
import { MessageModule } from 'src/message/message.module';
import { ServerModule } from 'src/server/server.module';

import { ChatGateway } from './gateway';

@Module({
	imports: [
		MessageModule,
		ChannelModule,
		ServerModule,
		MikroOrmModule.forFeature([Channel, User, Server, Category, FavouritedChannel]),
	],
	providers: [ChatGateway],
})
export class GatewayModule {}
