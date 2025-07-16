import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';

import { generateId } from '../../utils/generator';
import { Channel } from '../channel/Channel.entity';
import { Server } from '../server/Server.entity';

@Entity()
export class Category {

	@PrimaryKey()
	id: string = generateId(24);

	@Property()
	name!: string;

	@Property()
	description: string = 'An awesome category';

	@ManyToOne({ entity: () => Server })
	server!: Server;

	@OneToMany({ mappedBy: 'category', entity: () => Channel })
	channels: Collection<Channel> = new Collection<Channel>(this);

	async addChannel(channel: Channel) {
		if (!this.channels.contains(channel)) {
			this.channels.add(channel);
			channel.category = this;
		}
	}

	async removeChannel(channel: Channel) {
		if (this.channels.contains(channel)) {
			this.channels.remove(channel);
			channel.category = null;
		}
	}

	async setServer(server: Server) {
		if (!this.server) {
			this.server = server;
			server.categories.add(this);
		}
	}

}
