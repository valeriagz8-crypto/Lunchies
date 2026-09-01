"use client";

import { Fragment, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  ALLERGY_OPTIONS,
  CHILD_AGE_OPTIONS,
  PREFERENCE_OPTIONS,
  generateWeekPlan,
  getEmoji,
  type DayMeal,
} from "@/lib/lunchMenu";

type SavedPlan = {
  id: string;
  created_at: string;
  child_age: string;
  allergies: string[];
  preferences: string[];
  plan_json: DayMeal[];
};

const DAY_ICONS: Record<string, string> = {
  Monday: "🍱",
  Tuesday: "🥗",
  Wednesday: "🍽️",
  Thursday: "🥙",
  Friday: "🍲",
};

function toggleTag(list: string[], tag: string) {
  return list.includes(tag)
    ? list.filter((item) => item !== tag)
    : [...list, tag];
}

export default function CoreClient() {
  const [childAge, setChildAge] = useState(CHILD_AGE_OPTIONS[0]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<string[]>([]);

  const [plan, setPlan] = useState<DayMeal[] | null>(null);
  const [generated, setGenerated] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function loadSavedPlans() {
    setLoadingSaved(true);
    const { data, error } = await supabase
      .from("core_outputs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (!error && data) {
      setSavedPlans(data as SavedPlan[]);
    }
    setLoadingSaved(false);
  }

  useEffect(() => {
    loadSavedPlans();
  }, []);

  function handleGenerate() {
    setPlan(generateWeekPlan(allergies, preferences));
    setGenerated(true);
    setSaveMessage(null);
  }

  async function handleSave() {
    if (!plan) return;
    setSaving(true);
    setSaveMessage(null);

    const { error } = await supabase.from("core_outputs").insert({
      child_age: childAge,
      allergies,
      preferences,
      plan_json: plan,
    });

    if (error) {
      setSaveMessage("Something went wrong saving your plan. Try again.");
    } else {
      setSaveMessage("Plan saved!");
      await loadSavedPlans();
    }
    setSaving(false);
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-leaf-700 sm:text-4xl">
          Generative Core Agent
        </h1>
        <p className="mt-3 text-lg text-leaf-800">
          Tell us about your child and we&apos;ll put together a 5-day lunch
          plan in seconds.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* Section 1: Form */}
          <div className="rounded-2xl border border-leaf-100 bg-leaf-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-leaf-700">
              Tell us about your child
            </h2>

            <div className="mt-5">
              <label className="block text-sm font-medium text-leaf-800">
                Child&apos;s age
              </label>
              <select
                value={childAge}
                onChange={(e) => setChildAge(e.target.value)}
                className="mt-2 w-full max-w-xs rounded-lg border border-leaf-200 bg-white px-3 py-2 text-sm text-leaf-900 focus:border-leaf-500 focus:outline-none"
              >
                {CHILD_AGE_OPTIONS.map((age) => (
                  <option key={age} value={age}>
                    {age}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6">
              <span className="block text-sm font-medium text-leaf-800">
                Allergies
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {ALLERGY_OPTIONS.map((tag) => {
                  const active = allergies.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() =>
                        setAllergies((prev) => toggleTag(prev, tag))
                      }
                      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                        active
                          ? "border-peach-500 bg-peach-500 text-white"
                          : "border-peach-200 bg-white text-peach-700 hover:bg-peach-50"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6">
              <span className="block text-sm font-medium text-leaf-800">
                Food preferences
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {PREFERENCE_OPTIONS.map((tag) => {
                  const active = preferences.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() =>
                        setPreferences((prev) => toggleTag(prev, tag))
                      }
                      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                        active
                          ? "border-leaf-600 bg-leaf-600 text-white"
                          : "border-leaf-200 bg-white text-leaf-700 hover:bg-leaf-50"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              className="mt-7 rounded-full bg-leaf-600 px-8 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-leaf-700"
            >
              Generate menu
            </button>
          </div>

          {/* Section 2: Output */}
          <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-semibold text-leaf-700">
                Your 5-day lunch plan
              </h2>
              {generated && (
                <span className="rounded-full bg-leaf-100 px-3 py-1 text-xs font-semibold text-leaf-700">
                  Generated
                </span>
              )}
            </div>

            {!plan ? (
              <p className="mt-4 text-sm text-leaf-600">
                Fill out the form above and click{" "}
                <span className="font-medium">Generate menu</span> to see
                your plan.
              </p>
            ) : (
              <>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {plan.map((meal) => (
                    <div
                      key={meal.day}
                      className="rounded-xl border border-leaf-100 bg-leaf-50 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-leaf-800">
                          {meal.day}
                        </h3>
                        <span aria-hidden="true">{DAY_ICONS[meal.day]}</span>
                      </div>
                      <ul className="mt-3 space-y-1 text-sm text-leaf-700">
                        <li>
                          {getEmoji(meal.protein)} {meal.protein}
                        </li>
                        <li>
                          {getEmoji(meal.side)} {meal.side}
                        </li>
                        <li>
                          {getEmoji(meal.fruit)} {meal.fruit}
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleGenerate}
                    className="rounded-full border-2 border-leaf-600 px-6 py-2.5 font-semibold text-leaf-700 transition-colors hover:bg-leaf-50"
                  >
                    Generate again
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-full bg-peach-500 px-6 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-peach-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save plan"}
                  </button>
                  {saveMessage && (
                    <span className="text-sm font-medium text-leaf-700">
                      {saveMessage}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Section 3: Saved plans */}
          <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-leaf-700">
              Your saved lunch plans
            </h2>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-leaf-100 text-leaf-600">
                    <th className="py-2 pr-4 font-medium">Date</th>
                    <th className="py-2 pr-4 font-medium">Child&apos;s age</th>
                    <th className="py-2 pr-4 font-medium">Allergies</th>
                    <th className="py-2 pr-4 font-medium">Preferences</th>
                    <th className="py-2 pr-4 font-medium">Days</th>
                    <th className="py-2 pr-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingSaved && (
                    <tr>
                      <td colSpan={6} className="py-4 text-leaf-600">
                        Loading saved plans...
                      </td>
                    </tr>
                  )}

                  {!loadingSaved && savedPlans.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-4 text-leaf-600">
                        No saved plans yet — generate one above and click
                        Save plan.
                      </td>
                    </tr>
                  )}

                  {!loadingSaved &&
                    savedPlans.map((row) => (
                      <Fragment key={row.id}>
                        <tr className="border-b border-leaf-50 align-top text-leaf-800">
                          <td className="py-3 pr-4">
                            {new Date(row.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 pr-4">{row.child_age}</td>
                          <td className="py-3 pr-4">
                            {row.allergies.length > 0
                              ? row.allergies.join(", ")
                              : "None"}
                          </td>
                          <td className="py-3 pr-4">
                            {row.preferences.length > 0
                              ? row.preferences.join(", ")
                              : "None"}
                          </td>
                          <td className="py-3 pr-4">
                            {row.plan_json.length} days
                          </td>
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedId((prev) =>
                                    prev === row.id ? null : row.id,
                                  )
                                }
                                className="rounded-full border border-leaf-200 px-3 py-1 text-xs font-semibold text-leaf-700 transition-colors hover:bg-leaf-50"
                              >
                                View
                              </button>
                              <button
                                type="button"
                                disabled
                                title="Coming soon"
                                className="cursor-not-allowed rounded-full border border-leaf-100 px-2 py-1 text-xs text-leaf-300"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                        {expandedId === row.id && (
                          <tr className="border-b border-leaf-50 bg-leaf-50">
                            <td colSpan={6} className="px-2 py-4">
                              <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                                {row.plan_json.map((meal) => (
                                  <li
                                    key={meal.day}
                                    className="rounded-lg bg-white p-3 text-sm text-leaf-700 shadow-sm"
                                  >
                                    <p className="font-semibold text-leaf-800">
                                      {meal.day}
                                    </p>
                                    <p>
                                      {getEmoji(meal.protein)} {meal.protein}
                                    </p>
                                    <p>
                                      {getEmoji(meal.side)} {meal.side}
                                    </p>
                                    <p>
                                      {getEmoji(meal.fruit)} {meal.fruit}
                                    </p>
                                  </li>
                                ))}
                              </ul>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section 4: Sidebar */}
        <aside className="h-fit rounded-2xl border border-leaf-100 bg-leaf-100 p-6">
          <h2 className="text-lg font-semibold text-leaf-800">
            How it works
          </h2>
          <ol className="mt-4 space-y-4 text-sm text-leaf-800">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-xs font-bold text-white">
                1
              </span>
              <span>
                Tell us your child&apos;s age, allergies, and food
                preferences.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-xs font-bold text-white">
                2
              </span>
              <span>
                We instantly generate a 5-day lunch plan, filtering out
                anything on the allergy list.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-xs font-bold text-white">
                3
              </span>
              <span>
                Save your favorite plan so you can find it again later.
              </span>
            </li>
          </ol>
          <p className="mt-5 rounded-lg bg-white px-3 py-2 text-xs text-leaf-600">
            🔒 Your plans are saved securely in our database.
          </p>
        </aside>
      </div>
    </section>
  );
}
