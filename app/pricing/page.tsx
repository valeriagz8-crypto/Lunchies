import fs from "fs";
import path from "path";
import PricingClient from "./PricingClient";

// This page reads/writes Supabase live from the browser, so it has no
// meaningful static output — skip prerendering it at build time.
export const dynamic = "force-dynamic";

export default function PricingPage() {
  const hasBowlImage = fs.existsSync(
    path.join(process.cwd(), "public/images/bowl.png"),
  );

  return <PricingClient hasBowlImage={hasBowlImage} />;
}
