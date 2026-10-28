import { describe, expect, it } from "vitest";
import {
  ASSET_ERRORS,
  buildAssetPayload,
  buildExportText,
  validateAsset,
} from "@/lib/marketingExport";
import { calculateConversion, getLeader, tallyEvents } from "@/lib/abTest";
import type { AbEvent } from "@/lib/abTest";
import {
  CAMPAIGN_CALENDAR,
  SOCIAL_POSTS,
  VIDEO_SCRIPTS,
} from "@/lib/marketingData";

/** Rows written by these tests use this marker so cleanup can find them. */
const TEST_MARKER = "__test__";

describe("software", () => {
  it("Software 1: a marketing asset can be saved to Supabase, loaded back and deleted", async () => {
    const { supabase } = await import("@/lib/supabase");

    const payload = buildAssetPayload({
      title: TEST_MARKER,
      assetType: "Social post",
      content: "Temporary row written by the automated tests.",
    });

    try {
      const insertResult = await supabase
        .from("marketing_assets")
        .insert(payload);
      expect(insertResult.error).toBeNull();

      const selectResult = await supabase
        .from("marketing_assets")
        .select("title, asset_type, content")
        .eq("title", TEST_MARKER)
        .order("created_at", { ascending: false })
        .limit(1);
      expect(selectResult.error).toBeNull();

      const row = selectResult.data?.[0];
      expect(row).toBeDefined();
      expect(row?.title).toBe(TEST_MARKER);
      expect(row?.asset_type).toBe("Social post");
      expect(row?.content).toBe(
        "Temporary row written by the automated tests.",
      );
    } finally {
      await supabase
        .from("marketing_assets")
        .delete()
        .eq("title", TEST_MARKER);
    }

    // Nothing is left behind.
    const leftovers = await supabase
      .from("marketing_assets")
      .select("id")
      .eq("title", TEST_MARKER);
    expect(leftovers.error).toBeNull();
    expect(leftovers.data).toHaveLength(0);
  });

  it("Software 2: an asset with an empty title or empty content is rejected before it is saved", () => {
    // Pure validation: this test never touches Supabase.
    expect(validateAsset({ title: "", content: "Some content" })).toBe(
      ASSET_ERRORS.title,
    );
    expect(validateAsset({ title: "   ", content: "Some content" })).toBe(
      ASSET_ERRORS.title,
    );

    expect(validateAsset({ title: "Social post: Healthy habits", content: "" })).toBe(
      ASSET_ERRORS.content,
    );
    expect(
      validateAsset({ title: "Social post: Healthy habits", content: "   " }),
    ).toBe(ASSET_ERRORS.content);

    expect(
      validateAsset({
        title: "Social post: Healthy habits",
        content: "Plan once on Sunday and the week stops asking questions.",
      }),
    ).toBeNull();
  });

  it("Software 3: A/B view and click events are stored, counted and deleted", async () => {
    const { supabase } = await import("@/lib/supabase");

    try {
      const insertResult = await supabase.from("ab_events").insert([
        { test_name: TEST_MARKER, variant: "A", event_type: "view" },
        { test_name: TEST_MARKER, variant: "A", event_type: "click" },
      ]);
      expect(insertResult.error).toBeNull();

      const selectResult = await supabase
        .from("ab_events")
        .select("test_name, variant, event_type")
        .eq("test_name", TEST_MARKER);
      expect(selectResult.error).toBeNull();

      const totals = tallyEvents((selectResult.data ?? []) as AbEvent[]);
      expect(totals.A.views).toBe(1);
      expect(totals.A.clicks).toBe(1);
      expect(calculateConversion(totals.A.views, totals.A.clicks)).toBe(100);
    } finally {
      await supabase.from("ab_events").delete().eq("test_name", TEST_MARKER);
    }

    // Nothing is left behind.
    const leftovers = await supabase
      .from("ab_events")
      .select("id")
      .eq("test_name", TEST_MARKER);
    expect(leftovers.error).toBeNull();
    expect(leftovers.data).toHaveLength(0);
  });
});

describe("Extra unit checks", () => {
  it("buildExportText includes all 10 social posts, 3 video scripts and 14 calendar days", () => {
    const kit = buildExportText();

    expect(SOCIAL_POSTS).toHaveLength(10);
    for (const post of SOCIAL_POSTS) {
      expect(kit).toContain(post.title);
      expect(kit).toContain(post.caption);
    }

    expect(VIDEO_SCRIPTS).toHaveLength(3);
    for (const script of VIDEO_SCRIPTS) {
      expect(kit).toContain(script.title);
      expect(kit).toContain(script.hook);
    }

    expect(CAMPAIGN_CALENDAR).toHaveLength(14);
    for (const day of CAMPAIGN_CALENDAR) {
      expect(kit).toContain(day.topic);
    }
  });

  it("calculateConversion returns 0 with no views and 33.3 for 1 click in 3 views", () => {
    expect(calculateConversion(0, 0)).toBe(0);
    expect(calculateConversion(0, 5)).toBe(0);
    expect(calculateConversion(3, 1)).toBe(33.3);
  });

  it("getLeader returns null when the two variants tie", () => {
    expect(
      getLeader({ views: 10, clicks: 2 }, { views: 10, clicks: 2 }),
    ).toBeNull();

    // No clicks at all is also too early to call.
    expect(
      getLeader({ views: 10, clicks: 0 }, { views: 10, clicks: 0 }),
    ).toBeNull();
  });
});
