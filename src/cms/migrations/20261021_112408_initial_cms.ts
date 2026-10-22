import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('nl', 'en', 'ru', 'uk');
  CREATE TYPE "public"."enum_student_cases_contacts_type" AS ENUM('INSTAGRAM', 'WHATSAPP', 'TELEGRAM', 'TIKTOK', 'EMAIL', 'WEBSITE');
  CREATE TYPE "public"."enum_student_cases_training_status" AS ENUM('STUDYING', 'WAITING', 'COMPLETED');
  CREATE TYPE "public"."enum_student_cases_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__student_cases_v_version_contacts_type" AS ENUM('INSTAGRAM', 'WHATSAPP', 'TELEGRAM', 'TIKTOK', 'EMAIL', 'WEBSITE');
  CREATE TYPE "public"."enum__student_cases_v_version_training_status" AS ENUM('STUDYING', 'WAITING', 'COMPLETED');
  CREATE TYPE "public"."enum__student_cases_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__student_cases_v_published_locale" AS ENUM('nl', 'en', 'ru', 'uk');
  CREATE TYPE "public"."enum_training_applications_status" AS ENUM('STUDYING', 'WAITING', 'COMPLETED');
  CREATE TABLE "admins_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "admins" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "student_cases_contacts" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_student_cases_contacts_type",
  	"value" varchar
  );
  
  CREATE TABLE "student_cases_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" uuid,
  	"is_published" boolean DEFAULT false,
  	"is_cover" boolean DEFAULT false
  );
  
  CREATE TABLE "student_cases" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"student_name" varchar,
  	"photo_id" uuid,
  	"city" varchar,
  	"status" "enum_student_cases_training_status" DEFAULT 'WAITING',
  	"sort_order" numeric DEFAULT 0,
  	"publish_contacts" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_student_cases_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "student_cases_locales" (
  	"result_title" varchar,
  	"story" varchar,
  	"testimonial" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "_student_cases_v_version_contacts" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"type" "enum__student_cases_v_version_contacts_type",
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_student_cases_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"image_id" uuid,
  	"is_published" boolean DEFAULT false,
  	"is_cover" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_student_cases_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_student_name" varchar,
  	"version_photo_id" uuid,
  	"version_city" varchar,
  	"version_status" "enum__student_cases_v_version_training_status" DEFAULT 'WAITING',
  	"version_sort_order" numeric DEFAULT 0,
  	"version_publish_contacts" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__student_cases_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__student_cases_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_student_cases_v_locales" (
  	"version_result_title" varchar,
  	"version_story" varchar,
  	"version_testimonial" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" uuid NOT NULL
  );
  
  CREATE TABLE "training_applications" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"full_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"message" varchar,
  	"status" "enum_training_applications_status" DEFAULT 'WAITING' NOT NULL,
  	"application_date" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"alt" varchar NOT NULL,
  	"prefix" varchar DEFAULT '',
  	"_objectkey" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar
  );
  
  CREATE TABLE "payload_kv" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid,
  	"student_cases_id" uuid,
  	"training_applications_id" uuid,
  	"media_id" uuid
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"admins_id" uuid
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "admins_sessions" ADD CONSTRAINT "admins_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "student_cases_contacts" ADD CONSTRAINT "student_cases_contacts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."student_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "student_cases_gallery" ADD CONSTRAINT "student_cases_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "student_cases_gallery" ADD CONSTRAINT "student_cases_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."student_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "student_cases" ADD CONSTRAINT "student_cases_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "student_cases_locales" ADD CONSTRAINT "student_cases_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."student_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_student_cases_v_version_contacts" ADD CONSTRAINT "_student_cases_v_version_contacts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_student_cases_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_student_cases_v_version_gallery" ADD CONSTRAINT "_student_cases_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_student_cases_v_version_gallery" ADD CONSTRAINT "_student_cases_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_student_cases_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_student_cases_v" ADD CONSTRAINT "_student_cases_v_parent_id_student_cases_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."student_cases"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_student_cases_v" ADD CONSTRAINT "_student_cases_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_student_cases_v_locales" ADD CONSTRAINT "_student_cases_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_student_cases_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_student_cases_fk" FOREIGN KEY ("student_cases_id") REFERENCES "public"."student_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_training_applications_fk" FOREIGN KEY ("training_applications_id") REFERENCES "public"."training_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "admins_sessions_order_idx" ON "admins_sessions" USING btree ("_order");
  CREATE INDEX "admins_sessions_parent_id_idx" ON "admins_sessions" USING btree ("_parent_id");
  CREATE INDEX "admins_updated_at_idx" ON "admins" USING btree ("updated_at");
  CREATE INDEX "admins_created_at_idx" ON "admins" USING btree ("created_at");
  CREATE UNIQUE INDEX "admins_email_idx" ON "admins" USING btree ("email");
  CREATE INDEX "student_cases_contacts_order_idx" ON "student_cases_contacts" USING btree ("_order");
  CREATE INDEX "student_cases_contacts_parent_id_idx" ON "student_cases_contacts" USING btree ("_parent_id");
  CREATE INDEX "student_cases_gallery_order_idx" ON "student_cases_gallery" USING btree ("_order");
  CREATE INDEX "student_cases_gallery_parent_id_idx" ON "student_cases_gallery" USING btree ("_parent_id");
  CREATE INDEX "student_cases_gallery_image_idx" ON "student_cases_gallery" USING btree ("image_id");
  CREATE INDEX "student_cases_photo_idx" ON "student_cases" USING btree ("photo_id");
  CREATE INDEX "student_cases_updated_at_idx" ON "student_cases" USING btree ("updated_at");
  CREATE INDEX "student_cases_created_at_idx" ON "student_cases" USING btree ("created_at");
  CREATE INDEX "student_cases__status_idx" ON "student_cases" USING btree ("_status");
  CREATE UNIQUE INDEX "student_cases_locales_locale_parent_id_unique" ON "student_cases_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "student_cases_locales_parent_id_idx" ON "student_cases_locales" USING btree ("_parent_id");
  CREATE INDEX "_student_cases_v_version_contacts_order_idx" ON "_student_cases_v_version_contacts" USING btree ("_order");
  CREATE INDEX "_student_cases_v_version_contacts_parent_id_idx" ON "_student_cases_v_version_contacts" USING btree ("_parent_id");
  CREATE INDEX "_student_cases_v_version_gallery_order_idx" ON "_student_cases_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_student_cases_v_version_gallery_parent_id_idx" ON "_student_cases_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_student_cases_v_version_gallery_image_idx" ON "_student_cases_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_student_cases_v_parent_idx" ON "_student_cases_v" USING btree ("parent_id");
  CREATE INDEX "_student_cases_v_version_version_photo_idx" ON "_student_cases_v" USING btree ("version_photo_id");
  CREATE INDEX "_student_cases_v_version_version_updated_at_idx" ON "_student_cases_v" USING btree ("version_updated_at");
  CREATE INDEX "_student_cases_v_version_version_created_at_idx" ON "_student_cases_v" USING btree ("version_created_at");
  CREATE INDEX "_student_cases_v_version_version__status_idx" ON "_student_cases_v" USING btree ("version__status");
  CREATE INDEX "_student_cases_v_created_at_idx" ON "_student_cases_v" USING btree ("created_at");
  CREATE INDEX "_student_cases_v_updated_at_idx" ON "_student_cases_v" USING btree ("updated_at");
  CREATE INDEX "_student_cases_v_snapshot_idx" ON "_student_cases_v" USING btree ("snapshot");
  CREATE INDEX "_student_cases_v_published_locale_idx" ON "_student_cases_v" USING btree ("published_locale");
  CREATE INDEX "_student_cases_v_latest_idx" ON "_student_cases_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_student_cases_v_locales_locale_parent_id_unique" ON "_student_cases_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_student_cases_v_locales_parent_id_idx" ON "_student_cases_v_locales" USING btree ("_parent_id");
  CREATE INDEX "training_applications_updated_at_idx" ON "training_applications" USING btree ("updated_at");
  CREATE INDEX "training_applications_created_at_idx" ON "training_applications" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_admins_id_idx" ON "payload_locked_documents_rels" USING btree ("admins_id");
  CREATE INDEX "payload_locked_documents_rels_student_cases_id_idx" ON "payload_locked_documents_rels" USING btree ("student_cases_id");
  CREATE INDEX "payload_locked_documents_rels_training_applications_id_idx" ON "payload_locked_documents_rels" USING btree ("training_applications_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_admins_id_idx" ON "payload_preferences_rels" USING btree ("admins_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "admins_sessions" CASCADE;
  DROP TABLE "admins" CASCADE;
  DROP TABLE "student_cases_contacts" CASCADE;
  DROP TABLE "student_cases_gallery" CASCADE;
  DROP TABLE "student_cases" CASCADE;
  DROP TABLE "student_cases_locales" CASCADE;
  DROP TABLE "_student_cases_v_version_contacts" CASCADE;
  DROP TABLE "_student_cases_v_version_gallery" CASCADE;
  DROP TABLE "_student_cases_v" CASCADE;
  DROP TABLE "_student_cases_v_locales" CASCADE;
  DROP TABLE "training_applications" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_student_cases_contacts_type";
  DROP TYPE "public"."enum_student_cases_training_status";
  DROP TYPE "public"."enum_student_cases_status";
  DROP TYPE "public"."enum__student_cases_v_version_contacts_type";
  DROP TYPE "public"."enum__student_cases_v_version_training_status";
  DROP TYPE "public"."enum__student_cases_v_version_status";
  DROP TYPE "public"."enum__student_cases_v_published_locale";
  DROP TYPE "public"."enum_training_applications_status";`);
}
