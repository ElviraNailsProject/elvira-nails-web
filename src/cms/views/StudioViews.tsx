import { redirect } from "next/navigation";
import type { AdminViewServerProps } from "payload";
import { isAdmin } from "../access/admin";
import { AdminHeader } from "../components/admin-header/AdminHeader";
import { AdminWorkspace } from "@/features/admin-studio/shell/AdminWorkspace";
import { ContentWorkspace } from "@/features/admin-studio/shell/ContentWorkspace";
import { PromotionsEditor } from "@/features/admin-studio/promotions/PromotionsEditor";
import { SettingsEditor } from "@/features/admin-studio/settings/SettingsEditor";
import { AppointmentsWorkspace } from "@/features/admin-studio/appointments/AppointmentsWorkspace";

type AdminSection =
  "promotions" | "content" | "settings" | "dashboard" | "appointments";

function StudioView({
  initPageResult,
  section,
}: AdminViewServerProps & { section: AdminSection }) {
  // Payload custom views can be public by default: enforce authentication here too.
  const { req, permissions } = initPageResult;
  if (!isAdmin(req.user) || !permissions.canAccessAdmin) {
    redirect(
      `/admin/login?redirect=${encodeURIComponent(`/admin/studio/${section}`)}`,
    );
  }
  return (
    <>
      <AdminHeader />
      <AdminWorkspace ownerId={String(req.user!.id)}>
        {section === "promotions" ? (
          <PromotionsEditor />
        ) : section === "settings" ? (
          <SettingsEditor />
        ) : section === "dashboard" || section === "appointments" ? (
          <AppointmentsWorkspace dashboard={section === "dashboard"} />
        ) : (
          <ContentWorkspace />
        )}
      </AdminWorkspace>
    </>
  );
}

export const PromotionsView = (props: AdminViewServerProps) => (
  <StudioView {...props} section="promotions" />
);
export const ContentView = (props: AdminViewServerProps) => (
  <StudioView {...props} section="content" />
);
export const SettingsView = (props: AdminViewServerProps) => (
  <StudioView {...props} section="settings" />
);
export const DashboardView = (props: AdminViewServerProps) => (
  <StudioView {...props} section="dashboard" />
);
export const AppointmentsView = (props: AdminViewServerProps) => (
  <StudioView {...props} section="appointments" />
);
