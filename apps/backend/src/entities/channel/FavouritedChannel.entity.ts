import { Entity, ManyToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';

import { generateId } from '../../utils/generator';
import { Server } from '../server/Server.entity';
import { User } from '../user/User.entity';
import { Channel } from './Channel.entity';

@Entity()
@Unique({ properties: ['user', 'channel'] })
export class FavouritedChannel {

	@PrimaryKey({ type: 'string' })
	id: string = generateId();

	@ManyToOne(() => User)
	user!: User;

	@ManyToOne(() => Server)
	server!: Server;

	@ManyToOne(() => Channel)
	channel!: Channel;

	@Property({ onCreate: () => new Date() })
	createdAt: Date = new Date();

}