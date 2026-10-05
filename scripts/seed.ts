import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const services = [
  {
    id: "service-manicure",
    price: "45.00",
    duration: 60,
    type: "MAIN" as const,
    sortOrder: 1,
    translations: [
      {
        locale: "NL" as const,
        name: "Manicure",
        description: "Classic / combined manicure",
      },
      {
        locale: "EN" as const,
        name: "Manicure",
        description: "Classic / combined manicure",
      },
      {
        locale: "RU" as const,
        name: "Маникюр",
        description: "Классический / комбинированный маникюр",
      },
      {
        locale: "UK" as const,
        name: "Манікюр",
        description: "Класичний / комбінований манікюр",
      },
    ],
  },
  {
    id: "service-pedicure",
    price: "55.00",
    duration: 75,
    type: "MAIN" as const,
    sortOrder: 2,
    translations: [
      {
        locale: "NL" as const,
        name: "Pedicure",
        description: "Full pedicure",
      },
      {
        locale: "EN" as const,
        name: "Pedicure",
        description: "Full pedicure",
      },
      {
        locale: "RU" as const,
        name: "Педикюр",
        description: "Полный педикюр",
      },
      {
        locale: "UK" as const,
        name: "Педикюр",
        description: "Повний педикюр",
      },
    ],
  },
  {
    id: "service-gel",
    price: "50.00",
    duration: 75,
    type: "MAIN" as const,
    sortOrder: 3,
    translations: [
      {
        locale: "NL" as const,
        name: "Gel / Nail coating",
        description: "Gel or nail coating",
      },
      {
        locale: "EN" as const,
        name: "Gel / Nail coating",
        description: "Gel or nail coating",
      },
      {
        locale: "RU" as const,
        name: "Гель / покрытие ногтей",
        description: "Гель или покрытие ногтей",
      },
      {
        locale: "UK" as const,
        name: "Гель / покриття нігтів",
        description: "Гель або покриття нігтів",
      },
    ],
  },
  {
    id: "service-nail-design",
    price: "10.00",
    duration: 0,
    type: "ADD_ON" as const,
    sortOrder: 4,
    translations: [
      {
        locale: "NL" as const,
        name: "Nail design",
        description: "Design / French / ombre add-on",
      },
      {
        locale: "EN" as const,
        name: "Nail design",
        description: "Design / French / ombre add-on",
      },
      {
        locale: "RU" as const,
        name: "Дизайн ногтей",
        description: "Дизайн / френч / омбре, дополнение",
      },
      {
        locale: "UK" as const,
        name: "Дизайн нігтів",
        description: "Дизайн / френч / омбре, додаткова послуга",
      },
    ],
  },
];

async function main() {
  for (const service of services) {
    const { translations, ...serviceData } = service;

    await prisma.service.upsert({
      where: {
        id: service.id,
      },
      update: {
        price: serviceData.price,
        duration: serviceData.duration,
        type: serviceData.type,
        sortOrder: serviceData.sortOrder,
        isActive: true,
      },
      create: {
        ...serviceData,
        isActive: true,
      },
    });

    for (const translation of translations) {
      await prisma.serviceTranslation.upsert({
        where: {
          serviceId_locale: {
            serviceId: service.id,
            locale: translation.locale,
          },
        },
        update: {
          name: translation.name,
          description: translation.description,
        },
        create: {
          serviceId: service.id,
          locale: translation.locale,
          name: translation.name,
          description: translation.description,
        },
      });
    }
  }

  console.log("Services seeded successfully");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
