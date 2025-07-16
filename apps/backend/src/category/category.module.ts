import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { Category } from '../entities/category/Category.entity';
import { Channel } from '../entities/channel/Channel.entity';
import { Server } from '../entities/server/Server.entity';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
	imports: [MikroOrmModule.forFeature([Category, Server, Channel])],
	controllers: [CategoryController],
	providers: [CategoryService],
	exports: [CategoryService],
})
export class CategoryModule {}