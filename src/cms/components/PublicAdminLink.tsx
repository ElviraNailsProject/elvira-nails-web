import { headers } from "next/headers";
import Link from "next/link";
import { getCMS } from "@/cms/client";

export async function PublicAdminLink() {
  const requestHeaders = await headers();
  if (!requestHeaders.get("cookie")?.includes("elvira-cms-token")) return null;
  try {
    const cms = await getCMS();
    const { user } = await cms.auth({ headers: requestHeaders });
    if (user?.collection !== "admins") return null;
  } catch {
    return null;
  }
  return (
    <Link
      href="/admin/collections/student-cases"
      className="inline-flex min-h-11 items-center px-2 font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-[#4A3A32] transition-colors hover:text-[#815E37] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4A3A32]"
    >
      Admin
    </Link>
  );
}
