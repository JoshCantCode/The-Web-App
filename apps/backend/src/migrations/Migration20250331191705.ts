import { Migration } from '@mikro-orm/migrations';

export class Migration20250331191705 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" drop constraint "user_messages_id_foreign";`);

    this.addSql(`alter table "channel" drop constraint "channel_messages_id_foreign";`);
    this.addSql(`alter table "channel" drop constraint "channel_category_id_foreign";`);

    this.addSql(`alter table "user" drop column "messages_id";`);

    this.addSql(`alter table "channel" drop column "messages_id";`);

    this.addSql(`alter table "channel" alter column "category_id" type varchar(255) using ("category_id"::varchar(255));`);
    this.addSql(`alter table "channel" alter column "category_id" drop not null;`);
    this.addSql(`alter table "channel" add constraint "channel_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "message" add column "author_id" varchar(255) not null, add column "channel_id" varchar(255) not null;`);
    this.addSql(`alter table "message" add constraint "message_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "message" add constraint "message_channel_id_foreign" foreign key ("channel_id") references "channel" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "message" drop constraint "message_author_id_foreign";`);
    this.addSql(`alter table "message" drop constraint "message_channel_id_foreign";`);

    this.addSql(`alter table "channel" drop constraint "channel_category_id_foreign";`);

    this.addSql(`alter table "message" drop column "author_id", drop column "channel_id";`);

    this.addSql(`alter table "user" add column "messages_id" varchar(255) null;`);
    this.addSql(`alter table "user" add constraint "user_messages_id_foreign" foreign key ("messages_id") references "message" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "channel" add column "messages_id" varchar(255) null;`);
    this.addSql(`alter table "channel" alter column "category_id" type varchar(255) using ("category_id"::varchar(255));`);
    this.addSql(`alter table "channel" alter column "category_id" set not null;`);
    this.addSql(`alter table "channel" add constraint "channel_messages_id_foreign" foreign key ("messages_id") references "message" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "channel" add constraint "channel_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade;`);
  }

}
