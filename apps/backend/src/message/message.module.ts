import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ChannelModule } from 'src/channel/channel.module';
import { Channel } from 'src/entities/channel/Channel.entity';
import { Message } from 'src/entities/message/Message.entity';
import { UserModule } from 'src/user/user.module';

import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
	imports: [MikroOrmModule.forFeature([Channel, Message]), UserModule, ChannelModule],
	controllers: [MessageController],
	providers: [MessageService],
	exports: [MessageService],
})
export class MessageModule {}