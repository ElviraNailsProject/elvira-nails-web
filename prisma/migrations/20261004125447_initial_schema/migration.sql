-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('MAIN', 'ADD_ON');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InquiryTopic" AS ENUM ('TRAINING', 'STUDIO_APPOINTMENT', 'SOMETHING_ELSE');

-- CreateEnum
CREATE TYPE "TrainingApplicationStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'DATE_AGREED', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ContactMessageStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('NL', 'EN', 'RU');

-- CreateEnum
CREATE TYPE "StudentContactType" AS ENUM ('INSTAGRAM', 'WHATSAPP', 'TELEGRAM', 'TIKTOK', 'EMAIL', 'WEBSITE');

-- CreateEnum
CREATE TYPE "OfferTargetType" AS ENUM ('TRAINING', 'STUDIO_SERVICE');

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "duration" INTEGER NOT NULL,
    "type" "ServiceType" NOT NULL DEFAULT 'MAIN',
    "photoUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceTranslation" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "ServiceTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "notes" TEXT,
    "appointmentDate" TIMESTAMP(3) NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "privacyConsent" BOOLEAN NOT NULL,
    "cancellationConsent" BOOLEAN NOT NULL,
    "cancelledAt" TIMESTAMP(3),
    "cancellationReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppointmentService" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "AppointmentService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkingHours" (
    "id" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" INTEGER NOT NULL,
    "endTime" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "WorkingHours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockedDate" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "reason" TEXT,

    CONSTRAINT "BlockedDate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingApplication" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT,
    "privacyConsent" BOOLEAN NOT NULL,
    "status" "TrainingApplicationStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "topic" "InquiryTopic" NOT NULL,
    "message" TEXT NOT NULL,
    "privacyConsent" BOOLEAN NOT NULL,
    "status" "ContactMessageStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingProgram" (
    "id" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingProgramTranslation" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "TrainingProgramTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingStage" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingStageTranslation" (
    "id" TEXT NOT NULL,
    "stageId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "duration" TEXT,

    CONSTRAINT "TrainingStageTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQ" (
    "id" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQTranslation" (
    "id" TEXT NOT NULL,
    "faqId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "FAQTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentCase" (
    "id" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "initials" TEXT,
    "studentPhoto" TEXT,
    "caseDate" DATE,
    "city" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentCaseTranslation" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "resultTitle" TEXT,
    "story" TEXT,
    "testimonial" TEXT,
    "status" TEXT,

    CONSTRAINT "StudentCaseTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentCaseImage" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isCover" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "StudentCaseImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentCaseContact" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "type" "StudentContactType" NOT NULL,
    "value" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "StudentCaseContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "targetType" "OfferTargetType" NOT NULL,
    "validFrom" TIMESTAMP(3),
    "validUntil" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfferTranslation" (
    "id" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "altText" TEXT NOT NULL,

    CONSTRAINT "OfferTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "email" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "address" TEXT,
    "instagram" TEXT,
    "telegram" TEXT,
    "tiktok" TEXT,
    "website" TEXT,
    "kvkNumber" TEXT,
    "vatNumber" TEXT,
    "timeZone" TEXT NOT NULL DEFAULT 'Europe/Amsterdam',
    "bookingHorizonDays" INTEGER NOT NULL DEFAULT 21,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Service_type_idx" ON "Service"("type");

-- CreateIndex
CREATE INDEX "Service_isActive_idx" ON "Service"("isActive");

-- CreateIndex
CREATE INDEX "ServiceTranslation_locale_idx" ON "ServiceTranslation"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceTranslation_serviceId_locale_key" ON "ServiceTranslation"("serviceId", "locale");

-- CreateIndex
CREATE INDEX "Appointment_appointmentDate_idx" ON "Appointment"("appointmentDate");

-- CreateIndex
CREATE INDEX "Appointment_status_idx" ON "Appointment"("status");

-- CreateIndex
CREATE INDEX "AppointmentService_serviceId_idx" ON "AppointmentService"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentService_appointmentId_serviceId_key" ON "AppointmentService"("appointmentId", "serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkingHours_dayOfWeek_key" ON "WorkingHours"("dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "BlockedDate_date_key" ON "BlockedDate"("date");

-- CreateIndex
CREATE INDEX "TrainingApplication_status_idx" ON "TrainingApplication"("status");

-- CreateIndex
CREATE INDEX "TrainingApplication_createdAt_idx" ON "TrainingApplication"("createdAt");

-- CreateIndex
CREATE INDEX "ContactMessage_topic_idx" ON "ContactMessage"("topic");

-- CreateIndex
CREATE INDEX "ContactMessage_status_idx" ON "ContactMessage"("status");

-- CreateIndex
CREATE INDEX "ContactMessage_createdAt_idx" ON "ContactMessage"("createdAt");

-- CreateIndex
CREATE INDEX "TrainingProgramTranslation_locale_idx" ON "TrainingProgramTranslation"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingProgramTranslation_programId_locale_key" ON "TrainingProgramTranslation"("programId", "locale");

-- CreateIndex
CREATE INDEX "TrainingStage_programId_idx" ON "TrainingStage"("programId");

-- CreateIndex
CREATE INDEX "TrainingStageTranslation_locale_idx" ON "TrainingStageTranslation"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingStageTranslation_stageId_locale_key" ON "TrainingStageTranslation"("stageId", "locale");

-- CreateIndex
CREATE INDEX "FAQTranslation_locale_idx" ON "FAQTranslation"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "FAQTranslation_faqId_locale_key" ON "FAQTranslation"("faqId", "locale");

-- CreateIndex
CREATE INDEX "StudentCase_isPublished_idx" ON "StudentCase"("isPublished");

-- CreateIndex
CREATE INDEX "StudentCase_caseDate_idx" ON "StudentCase"("caseDate");

-- CreateIndex
CREATE INDEX "StudentCaseTranslation_locale_idx" ON "StudentCaseTranslation"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "StudentCaseTranslation_caseId_locale_key" ON "StudentCaseTranslation"("caseId", "locale");

-- CreateIndex
CREATE INDEX "StudentCaseImage_caseId_idx" ON "StudentCaseImage"("caseId");

-- CreateIndex
CREATE INDEX "StudentCaseContact_caseId_idx" ON "StudentCaseContact"("caseId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentCaseContact_caseId_type_key" ON "StudentCaseContact"("caseId", "type");

-- CreateIndex
CREATE INDEX "Offer_isActive_idx" ON "Offer"("isActive");

-- CreateIndex
CREATE INDEX "Offer_validUntil_idx" ON "Offer"("validUntil");

-- CreateIndex
CREATE INDEX "OfferTranslation_locale_idx" ON "OfferTranslation"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "OfferTranslation_offerId_locale_key" ON "OfferTranslation"("offerId", "locale");

-- AddForeignKey
ALTER TABLE "ServiceTranslation" ADD CONSTRAINT "ServiceTranslation_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentService" ADD CONSTRAINT "AppointmentService_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentService" ADD CONSTRAINT "AppointmentService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingProgramTranslation" ADD CONSTRAINT "TrainingProgramTranslation_programId_fkey" FOREIGN KEY ("programId") REFERENCES "TrainingProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingStage" ADD CONSTRAINT "TrainingStage_programId_fkey" FOREIGN KEY ("programId") REFERENCES "TrainingProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingStageTranslation" ADD CONSTRAINT "TrainingStageTranslation_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "TrainingStage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQTranslation" ADD CONSTRAINT "FAQTranslation_faqId_fkey" FOREIGN KEY ("faqId") REFERENCES "FAQ"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentCaseTranslation" ADD CONSTRAINT "StudentCaseTranslation_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "StudentCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentCaseImage" ADD CONSTRAINT "StudentCaseImage_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "StudentCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentCaseContact" ADD CONSTRAINT "StudentCaseContact_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "StudentCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferTranslation" ADD CONSTRAINT "OfferTranslation_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
