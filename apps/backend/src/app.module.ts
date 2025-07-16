import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import config from '../mikro-orm.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { ChannelModule } from './channel/channel.module';
import { MessageModule } from './message/message.module';
import { ServerModule } from './server/server.module';
import { UserModule } from './user/user.module';
import { GatewayModule } from './websocket/gateway.module';

@Module({
	imports: [MikroOrmModule.forRoot({ ...config, autoLoadEntities: true }), GatewayModule, ConfigModule.forRoot({
		isGlobal: true,
		envFilePath: '.env',
	}),	ChannelModule,	CategoryModule,	MessageModule,	UserModule,	ServerModule],

	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
