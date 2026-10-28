"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { copyToClipboard } from "@/lib/clipboard";
import { TIMED_OUT, withTimeout } from "@/lib/requestTimeout";
import { ASSET_ACTION_COPY, SAVED_ASSETS_COPY } from "@/lib/marketingData";
import {
  ASSET_TYPES,
  buildAssetPayload,
  validateAsset,
  type AssetType,
} from "@/lib/marketingExport";

type SavedAsset = {
  id: string;
  created_at: string;
  title: string;
  asset_type: string;
  content: string;
};

const FEEDBACK_MS = 2000;

const TYPE_STYLE: Record<string, string> = {
  "Social post": "bg-peach-100 text-peach-700",
  "Video script": "bg-leaf-100 text-leaf-700",
  Calendar: "bg-blue-100 text-blue-700",
  Copy: "bg-yellow-100 text-yellow-800",
  "Brand asset": "bg-gray-100 text-gray-700",
};

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function AssetRow({ asset }: { asset: SavedAsset }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  async function handleCopy() {
    const ok = await copyToClipboard(asset.content);
    setCopied(ok);
    timers.current.push(setTimeout(() => setCopied(false), FEEDBACK_MS));
  }

  return (
    <li className="rounded-2xl border border-leaf-100 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-poppins break-words font-semibold text-leaf-800">
            {asset.title}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span
              className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                TYPE_STYLE[asset.asset_type] ?? "bg-gray-100 text-gray-700"
              }`}
            >
              {asset.asset_type}
            </span>
            <span className="text-xs text-leaf-500">
              {formatDate(asset.created_at)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setExpanded((open) => !open)}
            aria-expanded={expanded}
            className="inline-flex items-center gap-1.5 rounded-full border border-leaf-200 px-3 py-1.5 text-xs font-semibold text-leaf-700 transition-colors hover:bg-leaf-50"
          >
            <span aria-hidden="true">{expanded ? "▲" : "▼"}</span>
            {expanded ? SAVED_ASSETS_COPY.hide : SAVED_ASSETS_COPY.view}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            aria-label={`Copy ${asset.title}`}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              copied
                ? "border-leaf-600 bg-leaf-600 text-white"
                : "border-leaf-200 text-leaf-700 hover:bg-leaf-50"
            }`}
          >
            <span aria-hidden="true">{copied ? "✓" : "📋"}</span>
            {copied ? ASSET_ACTION_COPY.copied : ASSET_ACTION_COPY.copy}
          </button>
        </div>
      </div>

      {expanded && (
        <pre className="mt-3 whitespace-pre-wrap break-words rounded-xl border border-leaf-100 bg-leaf-50 p-4 font-inter text-sm text-leaf-800">
          {asset.content}
        </pre>
      )}
    </li>
  );
}

export default function SavedAssets() {
  const [assets, setAssets] = useState<SavedAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [assetType, setAssetType] = useState<AssetType>(ASSET_TYPES[0]);
  const [content, setContent] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const startedRef = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const loadAssets = useCallback(async () => {
    const response = await withTimeout(
      supabase
        .from("marketing_assets")
        .select("id, created_at, title, asset_type, content")
        .order("created_at", { ascending: false }),
    );

    if (response === TIMED_OUT) {
      console.error("marketing_assets load timed out");
      setError(SAVED_ASSETS_COPY.timeout);
      setErrorDetail(null);
      return;
    }

    if (response.error) {
      console.error("marketing_assets load error:", response.error);
      setError(SAVED_ASSETS_COPY.error);
      setErrorDetail(response.error.message);
      return;
    }

    setError(null);
    setErrorDetail(null);
    setAssets((response.data ?? []) as SavedAsset[]);
  }, []);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    void (async () => {
      await loadAssets();
      setLoading(false);
    })();
  }, [loadAssets]);

  async function handleRefresh() {
    setRefreshing(true);
    await loadAssets();
    setRefreshing(false);
  }

  function resetForm() {
    setTitle("");
    setAssetType(ASSET_TYPES[0]);
    setContent("");
    setFormError(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const invalid = validateAsset({ title, content });
    if (invalid) {
      setFormError(invalid);
      return;
    }

    setFormError(null);
    setSaving(true);

    const response = await withTimeout(
      supabase
        .from("marketing_assets")
        .insert(buildAssetPayload({ title, assetType, content })),
    );
    setSaving(false);

    if (response === TIMED_OUT) {
      console.error("marketing_assets insert timed out");
      setFormError(ASSET_ACTION_COPY.saveTimeout);
      return;
    }

    if (response.error) {
      console.error("marketing_assets insert error:", response.error);
      setFormError(ASSET_ACTION_COPY.saveFailed);
      return;
    }

    resetForm();
    setFormOpen(false);
    setSavedFlash(true);
    timers.current.push(setTimeout(() => setSavedFlash(false), FEEDBACK_MS));
    await loadAssets();
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-leaf-700">{SAVED_ASSETS_COPY.intro}</p>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setFormOpen((open) => !open);
            setFormError(null);
          }}
          aria-expanded={formOpen}
          className="rounded-full bg-peach-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-peach-600"
        >
          {formOpen ? SAVED_ASSETS_COPY.cancel : SAVED_ASSETS_COPY.newAsset}
        </button>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="rounded-full border border-leaf-200 px-4 py-2 text-xs font-semibold text-leaf-700 transition-colors hover:bg-leaf-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {refreshing ? SAVED_ASSETS_COPY.refreshing : SAVED_ASSETS_COPY.refresh}
        </button>
        {savedFlash && (
          <span role="status" className="text-sm font-semibold text-leaf-700">
            <span aria-hidden="true">✓</span> {SAVED_ASSETS_COPY.saved}
          </span>
        )}
      </div>

      {formOpen && (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-2xl border border-leaf-100 bg-leaf-50 p-5 shadow-sm"
        >
          <h3 className="font-poppins text-base font-semibold text-leaf-700">
            {SAVED_ASSETS_COPY.formHeading}
          </h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium text-leaf-800">
                {SAVED_ASSETS_COPY.titleLabel}
              </span>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={SAVED_ASSETS_COPY.titlePlaceholder}
                className="mt-1 w-full rounded-xl border border-leaf-200 bg-white px-3 py-2 text-sm text-leaf-800 outline-none focus:border-leaf-500"
              />
            </label>

            <label className="block text-sm">
              <span className="font-medium text-leaf-800">
                {SAVED_ASSETS_COPY.typeLabel}
              </span>
              <select
                value={assetType}
                onChange={(event) =>
                  setAssetType(event.target.value as AssetType)
                }
                className="mt-1 w-full rounded-xl border border-leaf-200 bg-white px-3 py-2 text-sm text-leaf-800 outline-none focus:border-leaf-500"
              >
                {ASSET_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="mt-4 block text-sm">
            <span className="font-medium text-leaf-800">
              {SAVED_ASSETS_COPY.contentLabel}
            </span>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder={SAVED_ASSETS_COPY.contentPlaceholder}
              rows={5}
              className="mt-1 w-full rounded-xl border border-leaf-200 bg-white px-3 py-2 text-sm text-leaf-800 outline-none focus:border-leaf-500"
            />
          </label>

          {formError && (
            <p
              role="alert"
              className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
            >
              <span aria-hidden="true">⚠️</span> {formError}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-leaf-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-leaf-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? SAVED_ASSETS_COPY.saving : SAVED_ASSETS_COPY.save}
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setFormOpen(false);
              }}
              className="rounded-full border border-leaf-200 px-5 py-2.5 text-sm font-semibold text-leaf-700 transition-colors hover:bg-white"
            >
              {SAVED_ASSETS_COPY.cancel}
            </button>
          </div>
        </form>
      )}

      {error ? (
        <div className="rounded-2xl border border-peach-200 bg-peach-50 p-5">
          <p className="text-sm font-medium text-peach-800">
            <span aria-hidden="true">⚠️</span> {error}
          </p>
          {errorDetail && (
            <p className="mt-1 break-words text-xs text-peach-700">
              {errorDetail}
            </p>
          )}
        </div>
      ) : loading ? (
        <p className="text-sm text-leaf-600">{SAVED_ASSETS_COPY.loading}</p>
      ) : assets.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-leaf-200 bg-leaf-50 p-8 text-center">
          <span className="text-3xl" aria-hidden="true">
            💾
          </span>
          <p className="font-poppins mt-2 font-semibold text-leaf-800">
            {SAVED_ASSETS_COPY.empty}
          </p>
          <p className="mt-1 text-sm text-leaf-600">
            {SAVED_ASSETS_COPY.emptyHint}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {assets.map((asset) => (
            <AssetRow key={asset.id} asset={asset} />
          ))}
        </ul>
      )}
    </div>
  );
}
