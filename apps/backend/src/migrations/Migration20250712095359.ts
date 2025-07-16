import { Migration } from '@mikro-orm/migrations';

export class Migration20250712095359 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "message" add column "edited" boolean not null default false, add column "edited_metadata" jsonb not null;`);
    this.addSql(`alter table "message" alter column "edited_at" type date using ("edited_at"::date);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "message" drop column "edited", drop column "edited_metadata";`);

    this.addSql(`alter table "message" alter column "edited_at" type timestamptz using ("edited_at"::timestamptz);`);
  }

}
