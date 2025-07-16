import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { User } from 'src/entities/user/User.entity';
import { ServerModule } from 'src/server/server.module';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
	imports: [MikroOrmModule.forFeature([User]), ServerModule],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}