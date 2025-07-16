import { Migration } from '@mikro-orm/migrations';

export class Migration20250503211948 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "server" drop constraint "server_owner_id_foreign";`);

    this.addSql(`alter table "message" drop constraint "message_author_id_foreign";`);

    this.addSql(`alter table "favourited_channel" drop constraint "favourited_channel_user_id_foreign";`);

    this.addSql(`alter table "user_servers" drop constraint "user_servers_user_id_foreign";`);

    this.addSql(`create table "users" ("id" varchar(255) not null, "name" varchar(255) not null, "email" varchar(255) not null, "verified" boolean not null default false, "avatar" varchar(255) null, "password" varchar(255) not null, "created_at" varchar(255) not null, "updated_at" timestamptz not null, constraint "users_pkey" primary key ("id"));`);
    this.addSql(`alter table "users" add constraint "users_name_unique" unique ("name");`);
    this.addSql(`alter table "users" add constraint "users_email_unique" unique ("email");`);

    this.addSql(`create table "session" ("id" varchar(255) not null, "user_id_id" varchar(255) null, "token" varchar(255) not null, "ip" varchar(255) null, "user_agent" varchar(255) null, "expires_at" int not null, "created_at" int not null, "updated_at" int not null, constraint "session_pkey" primary key ("id"));`);
    this.addSql(`alter table "session" add constraint "session_user_id_id_unique" unique ("user_id_id");`);

    this.addSql(`create table "users_servers" ("user_id" varchar(255) not null, "server_id" varchar(255) not null, constraint "users_servers_pkey" primary key ("user_id", "server_id"));`);

    this.addSql(`alter table "session" add constraint "session_user_id_id_foreign" foreign key ("user_id_id") references "users" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "users_servers" add constraint "users_servers_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "users_servers" add constraint "users_servers_server_id_foreign" foreign key ("server_id") references "server" ("id") on update cascade on delete cascade;`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`drop table if exists "user_servers" cascade;`);

    this.addSql(`alter table "server" add constraint "server_owner_id_foreign" foreign key ("owner_id") references "users" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "message" add constraint "message_author_id_foreign" foreign key ("author_id") references "users" ("id") on update cascade;`);

    this.addSql(`alter table "favourited_channel" add constraint "favourited_channel_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "session" drop constraint "session_user_id_id_foreign";`);

    this.addSql(`alter table "server" drop constraint "server_owner_id_foreign";`);

    this.addSql(`alter table "message" drop constraint "message_author_id_foreign";`);

    this.addSql(`alter table "favourited_channel" drop constraint "favourited_channel_user_id_foreign";`);

    this.addSql(`alter table "users_servers" drop constraint "users_servers_user_id_foreign";`);

    this.addSql(`create table "user" ("id" varchar(255) not null, "username" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "created_at" varchar(255) not null, "updated_at" timestamptz not null, constraint "user_pkey" primary key ("id"));`);
    this.addSql(`alter table "user" add constraint "user_username_unique" unique ("username");`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);

    this.addSql(`create table "user_servers" ("user_id" varchar(255) not null, "server_id" varchar(255) not null, constraint "user_servers_pkey" primary key ("user_id", "server_id"));`);

    this.addSql(`alter table "user_servers" add constraint "user_servers_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "user_servers" add constraint "user_servers_server_id_foreign" foreign key ("server_id") references "server" ("id") on update cascade on delete cascade;`);

    this.addSql(`drop table if exists "users" cascade;`);

    this.addSql(`drop table if exists "session" cascade;`);

    this.addSql(`drop table if exists "users_servers" cascade;`);

    this.addSql(`alter table "server" drop constraint "server_owner_id_foreign";`);

    this.addSql(`alter table "message" drop constraint "message_author_id_foreign";`);

    this.addSql(`alter table "favourited_channel" drop constraint "favourited_channel_user_id_foreign";`);

    this.addSql(`alter table "server" add constraint "server_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "message" add constraint "message_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "favourited_channel" add constraint "favourited_channel_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
  }

}
