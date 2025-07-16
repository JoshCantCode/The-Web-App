import { Migration } from '@mikro-orm/migrations';

export class Migration20250330215445 extends Migration {

	override async up(): Promise<void> {
		this.addSql(`create table "message" ("id" varchar(255) not null, "content" varchar(255) not null, "created_at" timestamptz not null, "edited_at" timestamptz not null, constraint "message_pkey" primary key ("id"));`);

		this.addSql(`alter table "user" add column "messages_id" varchar(255) null;`);
		this.addSql(`alter table "user" add constraint "user_messages_id_foreign" foreign key ("messages_id") references "message" ("id") on update cascade on delete set null;`);

		this.addSql(`alter table "server" add column "created_at" timestamptz not null, add column "updated_at" timestamptz not null, add column "owner_id" varchar(255) null;`);
		this.addSql(`alter table "server" add constraint "server_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade on delete set null;`);
		this.addSql(`alter table "server" add constraint "server_owner_id_unique" unique ("owner_id");`);

		this.addSql(`alter table "channel" add column "messages_id" varchar(255) null;`);
		this.addSql(`alter table "channel" add constraint "channel_messages_id_foreign" foreign key ("messages_id") references "message" ("id") on update cascade on delete set null;`);
	}

	override async down(): Promise<void> {
		this.addSql(`alter table "user" drop constraint "user_messages_id_foreign";`);

		this.addSql(`alter table "channel" drop constraint "channel_messages_id_foreign";`);

		this.addSql(`drop table if exists "message" cascade;`);

		this.addSql(`alter table "server" drop constraint "server_owner_id_foreign";`);

		this.addSql(`alter table "server" drop constraint "server_owner_id_unique";`);
		this.addSql(`alter table "server" drop column "created_at", drop column "updated_at", drop column "owner_id";`);

		this.addSql(`alter table "channel" drop column "messages_id";`);

		this.addSql(`alter table "user" drop column "messages_id";`);
	}

}
