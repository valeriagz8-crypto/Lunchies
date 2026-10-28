"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { copyToClipboard } from "@/lib/clipboard";
import { TIMED_OUT, withTimeout } from "@/lib/requestTimeout";
import { ASSET_ACTION_COPY } from "@/lib/marketingData";
import { buildAssetPayload, type CardAsset } from "@/lib/marketingExport";

type CopyState = "idle" | "copied" | "failed";
type SaveState = "idle" | "saving" | "saved" | "failed";

const FEEDBACK_MS = 2000;

const BUTTON_BASE =
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60";

/** Copy and Save asset buttons, shared by every content card on the page. */
export default function CardActions({
  asset,
  className = "",
}: {
  asset: CardAsset;
  className?: string;
}) {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  function resetLater(reset: () => void) {
    timers.current.push(setTimeout(reset, FEEDBACK_MS));
  }

  async function handleCopy() {
    const copied = await copyToClipboard(asset.text);

    if (copied) {
      setMessage(null);
      setCopyState("copied");
      resetLater(() => setCopyState("idle"));
      return;
    }

    setCopyState("failed");
    setMessage(ASSET_ACTION_COPY.copyFailed);
    resetLater(() => setCopyState("idle"));
  }

  async function handleSave() {
    if (saveState === "saving") return;

    setSaveState("saving");
    setMessage(null);

    const payload = buildAssetPayload({
      title: asset.title,
      assetType: asset.assetType,
      content: asset.text,
    });

    const response = await withTimeout(
      supabase.from("marketing_assets").insert(payload),
    );

    if (response === TIMED_OUT) {
      console.error(`marketing_assets insert timed out: ${payload.title}`);
      setSaveState("failed");
      setMessage(ASSET_ACTION_COPY.saveTimeout);
      return;
    }

    if (response.error) {
      console.error("marketing_assets insert error:", response.error);
      setSaveState("failed");
      setMessage(ASSET_ACTION_COPY.saveFailed);
      return;
    }

    setSaveState("saved");
    resetLater(() => setSaveState("idle"));
  }

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copy ${asset.title}`}
          className={`${BUTTON_BASE} ${
            copyState === "copied"
              ? "border-leaf-600 bg-leaf-600 text-white"
              : "border-leaf-200 text-leaf-700 hover:bg-leaf-50"
          }`}
        >
          <span aria-hidden="true">{copyState === "copied" ? "✓" : "📋"}</span>
          {copyState === "copied"
            ? ASSET_ACTION_COPY.copied
            : ASSET_ACTION_COPY.copy}
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={saveState === "saving"}
          aria-label={`Save ${asset.title} to your assets`}
          className={`${BUTTON_BASE} ${
            saveState === "saved"
              ? "border-leaf-600 bg-leaf-600 text-white"
              : "border-leaf-200 text-leaf-700 hover:bg-leaf-50"
          }`}
        >
          <span aria-hidden="true">{saveState === "saved" ? "✓" : "💾"}</span>
          {saveState === "saving"
            ? ASSET_ACTION_COPY.saving
            : saveState === "saved"
              ? ASSET_ACTION_COPY.saved
              : ASSET_ACTION_COPY.save}
        </button>
      </div>

      {message && (
        <p role="status" className="mt-2 break-words text-xs text-peach-700">
          <span aria-hidden="true">⚠️</span> {message}
        </p>
      )}
    </div>
  );
}
