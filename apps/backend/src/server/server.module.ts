import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Server } from 'src/entities/server/Server.entity';
import { User } from 'src/entities/user/User.entity';

import { ServerController } from './server.controller';
import { ServerService } from './server.service';

@Module({
	imports: [MikroOrmModule.forFeature([Server, User])],
	controllers: [ServerController],
	providers: [ServerService],
	exports: [ServerService],
})
export class ServerModule {}