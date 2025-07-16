import { Migration } from '@mikro-orm/migrations';

export class Migration20250330051503 extends Migration {

	override async up(): Promise<void> {
		this.addSql(`create table "server" ("id" varchar(255) not null, "name" varchar(255) not null, "description" varchar(255) not null, constraint "server_pkey" primary key ("id"));`);

		this.addSql(`create table "category" ("id" varchar(255) not null, "name" varchar(255) not null, "description" varchar(255) not null default 'An awesome category', "server_id" varchar(255) not null, constraint "category_pkey" primary key ("id"));`);

		this.addSql(`create table "channel" ("id" varchar(255) not null, "name" varchar(255) not null, "description" varchar(255) not null default 'An awesome channel', "category_id" varchar(255) not null, constraint "channel_pkey" primary key ("id"));`);

		this.addSql(`create table "user" ("id" varchar(255) not null, "username" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "user_pkey" primary key ("id"));`);

		this.addSql(`create table "user_servers" ("user_id" varchar(255) not null, "server_id" varchar(255) not null, constraint "user_servers_pkey" primary key ("user_id", "server_id"));`);

		this.addSql(`alter table "category" add constraint "category_server_id_foreign" foreign key ("server_id") references "server" ("id") on update cascade;`);

		this.addSql(`alter table "channel" add constraint "channel_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade;`);

		this.addSql(`alter table "user_servers" add constraint "user_servers_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`);
		this.addSql(`alter table "user_servers" add constraint "user_servers_server_id_foreign" foreign key ("server_id") references "server" ("id") on update cascade on delete cascade;`);
	}

	override async down(): Promise<void> {
		this.addSql(`alter table "category" drop constraint "category_server_id_foreign";`);

		this.addSql(`alter table "user_servers" drop constraint "user_servers_server_id_foreign";`);

		this.addSql(`alter table "channel" drop constraint "channel_category_id_foreign";`);

		this.addSql(`alter table "user_servers" drop constraint "user_servers_user_id_foreign";`);

		this.addSql(`drop table if exists "server" cascade;`);

		this.addSql(`drop table if exists "category" cascade;`);

		this.addSql(`drop table if exists "channel" cascade;`);

		this.addSql(`drop table if exists "user" cascade;`);

		this.addSql(`drop table if exists "user_servers" cascade;`);
	}

}
