import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const supportedLocales = ["NL", "EN", "RU", "UK"] as const;
type SupportedLocale = (typeof supportedLocales)[number];

function isSupportedLocale(value: string): value is SupportedLocale {
  return supportedLocales.includes(value as SupportedLocale);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const localeParam = searchParams.get("locale")?.toUpperCase() ?? "EN";

    if (!isSupportedLocale(localeParam)) {
      return NextResponse.json(
        {
          error: "INVALID_LOCALE",
          message: "Supported locales: NL, EN, RU, UK",
        },
        { status: 400 },
      );
    }

    const services = await prisma.service.findMany({
      where: {
        isActive: true,
      },
      include: {
        translations: {
          where: {
            locale: localeParam,
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

    const data = services.map((service) => {
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

    return NextResponse.json({
      locale: localeParam.toLowerCase(),
      data,
    });
  } catch (error) {
    console.error("Failed to fetch services:", error);

    return NextResponse.json(
      {
        error: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch services",
      },
      { status: 500 },
    );
  }
}
