import { Migration } from '@mikro-orm/migrations';

export class Migration20250417092511 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "channel" add column "server_id" varchar(255) not null;`);
    this.addSql(`alter table "channel" add constraint "channel_server_id_foreign" foreign key ("server_id") references "server" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "channel" drop constraint "channel_server_id_foreign";`);

    this.addSql(`alter table "channel" drop column "server_id";`);
  }

}
