import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import AdminProjectsClient from "./AdminProjectsClient";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const allowedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const userEmail = user?.email?.trim().toLowerCase();

  if (error || !user || !allowedEmail || userEmail !== allowedEmail) {
    redirect("/login");
  }

  return <AdminProjectsClient />;
}
