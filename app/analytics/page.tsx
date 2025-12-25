import { cookies } from "next/headers";
import { AnalyticsPageClient } from "./page-client";

export default async function AnalyticsPage() {
  const cookieStore = await cookies();
  const sidebarState = cookieStore.get("sidebar_state")?.value === "true";
  return <AnalyticsPageClient defaultSidebarOpen={sidebarState} />;
}
