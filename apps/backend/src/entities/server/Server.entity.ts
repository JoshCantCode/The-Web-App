import { Collection, Entity, ManyToMany, OneToMany, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';

import { generateId } from '../../utils/generator';
import { Category } from '../category/Category.entity';
import { Channel } from '../channel/Channel.entity';
import { FavouritedChannel } from '../channel/FavouritedChannel.entity';
import { User } from '../user/User.entity';

@Entity()
export class Server {

	@PrimaryKey()
	id: string = generateId();

	@Property()
	name!: string;

	@Property()
	description!: string;

	@OneToMany({ mappedBy: 'server', entity: () => Category })
	categories = new Collection<Category>(this);

	@ManyToMany({ name: 'members', mappedBy: 'servers', entity: () => User })
	members = new Collection<User>(this);

	@Property({ onCreate: () => new Date() })
	createdAt: Date = new Date();

	@Property({ onUpdate: () => new Date() })
	updatedAt: Date = new Date();

	@OneToOne({ entity: () => User, nullable: true, inversedBy: 'ownedServer' })
	owner: User;

	@OneToMany(() => FavouritedChannel, fav => fav.server)
	favouritedChannels = new Collection<FavouritedChannel>(this);

	@OneToMany({ entity: () => Channel, mappedBy: 'server' })
	channels: Channel[];

	async addMember(user: User) {
		if (!this.members.contains(user)) {
			this.members.add(user);
			user.servers.add(this);
		}
	}

	async setOwner(user: User) {
		if (!this.owner) {
			this.owner = user;
			user.ownedServer = this;
		}
	}

	async removeMember(user: User) {
		if (this.members.contains(user)) {
			this.members.remove(user);
			user.servers.remove(this);
		}
	}

}
