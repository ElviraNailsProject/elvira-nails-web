import {
  type MigrateUpArgs,
  type MigrateDownArgs,
  sql,
} from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "student_cases" ADD COLUMN "training_start_date" timestamp(3) with time zone;
  ALTER TABLE "student_cases" ADD COLUMN "training_end_date" timestamp(3) with time zone;
  ALTER TABLE "_student_cases_v" ADD COLUMN "version_training_start_date" timestamp(3) with time zone;
  ALTER TABLE "_student_cases_v" ADD COLUMN "version_training_end_date" timestamp(3) with time zone;`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "student_cases" DROP COLUMN "training_start_date";
  ALTER TABLE "student_cases" DROP COLUMN "training_end_date";
  ALTER TABLE "_student_cases_v" DROP COLUMN "version_training_start_date";
  ALTER TABLE "_student_cases_v" DROP COLUMN "version_training_end_date";`);
}
