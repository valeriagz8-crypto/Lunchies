import MarketingClient from "./MarketingClient";

// The tabs hold client state, so there is no meaningful static output to
// prerender at build time.
export const dynamic = "force-dynamic";

export default function MarketingPage() {
  return <MarketingClient />;
}
