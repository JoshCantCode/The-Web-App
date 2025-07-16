import { Collection, Entity, ManyToMany, OneToMany, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';

import { generateId } from '../../utils/generator';
import { FavouritedChannel } from '../channel/FavouritedChannel.entity';
import { Message } from '../message/Message.entity';
import { Server } from '../server/Server.entity';

@Entity({ tableName: 'users' })
export class User {

	@PrimaryKey({ type: 'string', unique: true })
	id: string = generateId(64);

	@Property({ type: 'string', unique: true })
	name!: string;

	@Property({ type: 'string', unique: true })
	email!: string;

	@Property({ type: 'boolean', fieldName: 'emailVerified' })
	verified: boolean = false;

	@Property({ type: 'string', nullable: true, fieldName: 'image' })
	avatar?: string;

	@Property({ fieldName: 'createdAt' })
	createdAt: Date = new Date();

	@Property({ onUpdate: () => new Date(), fieldName: 'updatedAt' })
	updatedAt: Date = new Date();

	@ManyToMany({ entity: () => Server })
	servers = new Collection<Server>(this);

	@OneToMany({ entity: () => Message, mappedBy: 'author' })
	messages = new Collection<Message>(this); // FIXED: A user can have MANY messages

	@OneToOne({ entity: () => Server, nullable: true, mappedBy: 'owner' })
	ownedServer?: Server;

	@OneToMany(() => FavouritedChannel, fav => fav.user, { orphanRemoval: true })
	favouritedChannels = new Collection<FavouritedChannel>(this);

}
