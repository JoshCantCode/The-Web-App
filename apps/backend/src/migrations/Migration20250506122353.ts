import { Migration } from '@mikro-orm/migrations';

export class Migration20250506122353 extends Migration {

  override async up(): Promise<void> {
    // Check if password column exists before trying to drop it
    this.addSql(`
      DO $$ 
      BEGIN 
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'password'
        ) THEN 
          ALTER TABLE "users" DROP COLUMN "password";
        END IF;
      END $$;
    `);
  }

  override async down(): Promise<void> {
    // Only add the column if it doesn't exist
    this.addSql(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'password'
        ) THEN 
          ALTER TABLE "users" ADD COLUMN "password" varchar(255) NOT NULL;
        END IF;
      END $$;
    `);
  }

}
