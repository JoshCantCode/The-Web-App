import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';

import { generateId } from '../../utils/generator';
import { Category } from '../category/Category.entity';
import { Message } from '../message/Message.entity';
import { Server } from '../server/Server.entity';
import { FavouritedChannel } from './FavouritedChannel.entity';

@Entity()
export class Channel {

	@PrimaryKey()
	id: string = generateId(24);

	@Property()
	name!: string;

	@Property()
	description: string = 'An awesome channel';

	@ManyToOne({ entity: () => Category })
	category?: Category;

	@ManyToOne({ entity: () => Server, inversedBy: 'channels' })
	server: Server;

	@OneToMany({ entity: () => Message, nullable: true, mappedBy: 'channel' })
	messages: Message[];

	@OneToMany(() => FavouritedChannel, fav => fav.channel, { orphanRemoval: true })
	favouritedBy = new Collection<FavouritedChannel>(this);

}
