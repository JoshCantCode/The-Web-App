import { Migration } from '@mikro-orm/migrations';

export class Migration20250503212036 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`drop table if exists "session" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "session" ("id" varchar(255) not null, "user_id_id" varchar(255) null, "token" varchar(255) not null, "ip" varchar(255) null, "user_agent" varchar(255) null, "expires_at" int not null, "created_at" int not null, "updated_at" int not null, constraint "session_pkey" primary key ("id"));`);
    this.addSql(`alter table "session" add constraint "session_user_id_id_unique" unique ("user_id_id");`);

    this.addSql(`alter table "session" add constraint "session_user_id_id_foreign" foreign key ("user_id_id") references "users" ("id") on update cascade on delete set null;`);
  }

}
