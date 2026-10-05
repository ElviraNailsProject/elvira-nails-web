import { prisma } from "@/lib/prisma";
import type { Locale } from "@/generated/prisma/client";

export async function getActiveServices(locale: Locale) {
  const services = await prisma.service.findMany({
    where: {
      isActive: true,
    },
    include: {
      translations: {
        where: {
          locale,
        },
        select: {
          name: true,
          description: true,
        },
      },
    },
    orderBy: {
      sortOrder: "asc",
    },
  });

  return services.map((service) => {
    const translation = service.translations[0];

    return {
      id: service.id,
      name: translation?.name ?? null,
      description: translation?.description ?? null,
      price: service.price,
      duration: service.duration,
      type: service.type,
      photoUrl: service.photoUrl,
    };
  });
}
