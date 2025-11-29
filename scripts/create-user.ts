import { createClient } from "@supabase/supabase-js";

async function main() {
  const url = process.env.SUPABASE_URL as string;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE as string;
  if (!url || !serviceKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE env vars.");
    process.exit(1);
  }
  const email = process.env.SOFIA_EMAIL as string;
  const password = process.env.SOFIA_PASSWORD as string;
  if (!email || !password) {
    console.error("Provide SOFIA_EMAIL and SOFIA_PASSWORD env vars.");
    process.exit(1);
  }
  const admin = createClient(url, serviceKey);
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) {
    console.error("Error creating user:", error.message);
    process.exit(1);
  }
  console.log("Created user:", data.user?.id, data.user?.email);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
