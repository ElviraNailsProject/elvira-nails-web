import { NextResponse } from "next/server";
import { parseLocale } from "@/lib/locale";
import { getActiveServices } from "@/server/services/services.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = parseLocale(searchParams.get("locale"));

    const services = await getActiveServices(locale);

    return NextResponse.json({
      locale: locale.toLowerCase(),
      data: services,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_LOCALE") {
      return NextResponse.json(
        {
          error: "INVALID_LOCALE",
          message: "Supported locales: nl, en, ru, uk",
        },
        { status: 400 },
      );
    }

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
