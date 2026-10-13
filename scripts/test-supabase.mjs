
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

const { data, error } = await supabase
  .from("projects")
  .select("id")
  .limit(1);

if (error) {
  console.error("Supabase query gagal:", error.message);
  process.exitCode = 1;
} else {
  console.log("Supabase berhasil merespons!");
  console.log("Query projects berhasil dijalankan.");
}
