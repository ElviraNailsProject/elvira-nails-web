import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { getRequestLanguage } from "payload";
import config from "@payload-config";
import { RootPage, generatePageMetadata } from "@payloadcms/next/views";
import { importMap } from "../importMap";
import { studioPageTitle } from "@/cms/views/studio-page-titles";

type Props = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
};
export const dynamic = "force-dynamic";
export const generateMetadata = async ({
  params,
  searchParams,
}: Props): Promise<Metadata> => {
  const metadata = await generatePageMetadata({ config, params, searchParams });
  const { segments = [] } = await params;
  if (segments[0] !== "studio") return metadata;
  const language = getRequestLanguage({
    config: await config,
    cookies: await cookies(),
    headers: await headers(),
  });
  const title = studioPageTitle(segments, language);
  return title
    ? { ...metadata, title, openGraph: { ...metadata.openGraph, title } }
    : metadata;
};
export default function Page({ params, searchParams }: Props) {
  return RootPage({ config, params, searchParams, importMap });
}
