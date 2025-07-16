import { Migration } from '@mikro-orm/migrations';

export class Migration20250503213333 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "users" rename column "verified" to "emailVerified";`);
    this.addSql(`alter table "users" rename column "avatar" to "image";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "users" rename column "emailVerified" to "verified";`);
    this.addSql(`alter table "users" rename column "image" to "avatar";`);
  }

}
