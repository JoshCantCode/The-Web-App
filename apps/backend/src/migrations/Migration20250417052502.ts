import { Migration } from '@mikro-orm/migrations';

export class Migration20250417052502 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "favourited_channel" ("id" varchar(255) not null, "user_id" varchar(255) not null, "server_id" varchar(255) not null, "channel_id" varchar(255) not null, "created_at" timestamptz not null, constraint "favourited_channel_pkey" primary key ("id"));`);
    this.addSql(`alter table "favourited_channel" add constraint "favourited_channel_user_id_channel_id_unique" unique ("user_id", "channel_id");`);

    this.addSql(`alter table "favourited_channel" add constraint "favourited_channel_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "favourited_channel" add constraint "favourited_channel_server_id_foreign" foreign key ("server_id") references "server" ("id") on update cascade;`);
    this.addSql(`alter table "favourited_channel" add constraint "favourited_channel_channel_id_foreign" foreign key ("channel_id") references "channel" ("id") on update cascade;`);

    this.addSql(`alter table "user" alter column "created_at" type varchar(255) using ("created_at"::varchar(255));`);
    this.addSql(`alter table "user" add constraint "user_username_unique" unique ("username");`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "favourited_channel" cascade;`);

    this.addSql(`alter table "user" drop constraint "user_username_unique";`);
    this.addSql(`alter table "user" drop constraint "user_email_unique";`);

    this.addSql(`alter table "user" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
  }

}
