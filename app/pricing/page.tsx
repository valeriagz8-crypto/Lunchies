import PricingClient from "./PricingClient";

// This page reads/writes Supabase live from the browser, so it has no
// meaningful static output — skip prerendering it at build time.
export const dynamic = "force-dynamic";

export default function PricingPage() {
  return <PricingClient />;
}
