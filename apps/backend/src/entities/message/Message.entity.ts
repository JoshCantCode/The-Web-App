import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';

import { Channel } from '../channel/Channel.entity';
import { User } from '../user/User.entity';
import { EditedMetadata } from '@the-web-app/types';

@Entity()
export class Message {

	@PrimaryKey()
	id!: string;

	@Property()
	content!: string; // Change to MessageContent soon

	@ManyToOne({ entity: () => User, inversedBy: 'messages' })
	author!: User;

	@Property()
	createdAt: Date = new Date();

	@Property({ type: 'boolean' })
	edited: boolean = false;

	@Property({ type: 'json' })
	editedMetadata: EditedMetadata[] = [];

	@Property({ type: 'date' })
	editedAt: Date = new Date();

	@ManyToOne({ entity: () => Channel, inversedBy: 'messages' })
	channel!: Channel;

}