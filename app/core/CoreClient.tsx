"use client";

import { Fragment, useEffect, useState } from "react";
import { CalendarDays, Sparkles, Utensils } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  ALLERGY_OPTIONS,
  CHILD_AGE_OPTIONS,
  PREFERENCE_OPTIONS,
  generateWeekPlan,
  getEmoji,
  type DayMeal,
} from "@/lib/lunchMenu";
import {
  Card,
  CardHead,
  HeroArt,
  IconBadge,
  PageHero,
  PageShell,
  StepRing,
  TableWrap,
} from "@/components/ui/pieces";
import {
  BTN_GHOST,
  BTN_PRIMARY,
  BTN_ROW,
  BTN_ROW_DANGER,
  BTN_SECONDARY,
  CHIP_GREEN,
  CHIP_GREEN_ON,
  CHIP_PEACH,
  CHIP_PEACH_ON,
  FIELD,
  FIELD_LABEL,
  TINT,
  type TintName,
} from "@/components/ui/theme";

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

/** Pastel tint per weekday card, matching the mockup's colour rhythm. */
const DAY_TINTS: TintName[] = ["green", "pink", "cream", "blue", "green"];

/** Day-name ink per weekday card, following the mockup. */
const DAY_INK = [
  "text-leaf-700",
  "text-peach-600",
  "text-amber-700",
  "text-sky-700",
  "text-leaf-700",
];

const VALUE_PROPS = [
  {
    icon: "🌱",
    title: "Balanced & healthy",
    description: "Nutritious meals for growing minds and bodies.",
  },
  {
    icon: "🙂",
    title: "Kid-approved",
    description: "Tasty recipes kids love, every time.",
  },
  {
    icon: "⏱️",
    title: "Saves you time",
    description: "Plan once and we help you all week long.",
  },
  {
    icon: "🛡️",
    title: "Made for families",
    description: "Allergies, preferences and schedules — handled.",
  },
];

/** Pastel tint per value prop, so the row reads as one set of cards. */
const VALUE_PROP_TINTS: TintName[] = ["green", "peach", "blue", "pink"];

/** The orange icon beside each "How it works" step in the mockup. */
const HOW_ICONS = [Utensils, Sparkles, CalendarDays];

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
  const [visibleRows, setVisibleRows] = useState(5);

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

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this saved lunch plan?")) return;

    const { error } = await supabase.from("core_outputs").delete().eq("id", id);

    if (!error) {
      setSavedPlans((prev) => prev.filter((row) => row.id !== id));
      setExpandedId((prev) => (prev === id ? null : prev));
    }
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
    <PageShell>
      <PageHero
        title={
          <>
            Create a personalized{" "}
            <span className="text-peach-500">
              <span className="whitespace-nowrap">5-day</span> lunch plan
            </span>
          </>
        }
        subtitle={
          <>
            Tell us about your child and we&apos;ll create a balanced, tasty
            and fun lunch plan just for them.
          </>
        }
        art={
          <HeroArt
            src="/images/redesign/hero-core.webp"
            width={592}
            height={488}
            tone="leaf"
            priority
            glyph="🍱"
          />
        }
      />

      {/*
        Form beside "How it works" on wide screens, the way the mockup shows
        it, while the DOM order stays exactly as it was.
      */}
      <div className="mt-10 grid gap-5 lg:grid-cols-[1.45fr_1fr]">
        {/* Section 1: Form */}
        <Card tint="green" className="p-6 sm:p-7 lg:col-start-1 lg:row-start-1">
          <CardHead
            step="1"
            badge={<IconBadge tint="green">📝</IconBadge>}
            title="Tell us about your child"
          />

          <div className="mt-7">
            <label className={FIELD_LABEL}>Child&apos;s age</label>
            <select
              value={childAge}
              onChange={(e) => setChildAge(e.target.value)}
              className={`${FIELD} mt-2.5`}
            >
              {CHILD_AGE_OPTIONS.map((age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6">
            <span className={FIELD_LABEL}>Allergies</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {ALLERGY_OPTIONS.map((tag) => {
                const active = allergies.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setAllergies((prev) => toggleTag(prev, tag))}
                    className={active ? CHIP_PEACH_ON : CHIP_PEACH}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <span className={FIELD_LABEL}>Food preferences</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {PREFERENCE_OPTIONS.map((tag) => {
                const active = preferences.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      setPreferences((prev) => toggleTag(prev, tag))
                    }
                    className={active ? CHIP_GREEN_ON : CHIP_GREEN}
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
            className={`${BTN_PRIMARY} mt-8 px-10 py-4 text-base`}
          >
            Generate menu
          </button>

          <div className="mt-6 flex items-start gap-2.5 rounded-2xl bg-white/70 px-4 py-3 text-[13px] leading-relaxed text-leaf-600">
            <span aria-hidden="true">ℹ️</span>
            <span>
              We&apos;ll use this information to create a balanced and
              personalized lunch plan for your child.
            </span>
          </div>
        </Card>

        {/* Section 2: Output */}
        <Card
          tint="plain"
          className="p-6 sm:p-8 lg:col-span-2 lg:col-start-1 lg:row-start-2"
        >
          <CardHead
            step="2"
            badge={<IconBadge tint="peach">🍽️</IconBadge>}
            title="Your 5-day lunch plan"
            action={
              generated ? (
                <span className="rounded-full bg-leaf-100 px-4 py-2 text-xs font-bold text-leaf-700">
                  Generated
                </span>
              ) : undefined
            }
          />

          {!plan ? (
            <p className="mt-6 rounded-2xl bg-cream-100 px-5 py-4 text-[15px] text-leaf-600">
              Fill out the form above and click{" "}
              <span className="font-bold text-leaf-800">Generate menu</span> to
              see your plan.
            </p>
          ) : (
            <>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {plan.map((meal, index) => {
                  const tint = TINT[DAY_TINTS[index % DAY_TINTS.length]];
                  return (
                    <div
                      key={meal.day}
                      className={`rounded-3xl border p-4 ${tint.card}`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <h3
                          className={`font-poppins text-lg font-extrabold ${
                            DAY_INK[index % DAY_INK.length]
                          }`}
                        >
                          {meal.day}
                        </h3>
                        <span className="text-base" aria-hidden="true">
                          {DAY_ICONS[meal.day]}
                        </span>
                      </div>
                      <ul className="mt-3 space-y-1.5 px-1 pb-1 text-[13px] leading-snug text-leaf-800">
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
                  );
                })}
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleGenerate}
                  className={BTN_GHOST}
                >
                  Generate again
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className={BTN_SECONDARY}
                >
                  {saving ? "Saving..." : "Save plan"}
                </button>
                {saveMessage && (
                  <span className="text-sm font-bold text-leaf-700">
                    {saveMessage}
                  </span>
                )}
              </div>
              <p className="mt-4 flex items-center gap-2 rounded-2xl bg-cream-100 px-4 py-3 text-[13px] text-leaf-600">
                <span aria-hidden="true">🔒</span>
                Your plan will be saved so you can see it later.
              </p>
            </>
          )}
        </Card>

        {/* Section 3: Saved plans */}
        <Card
          tint="plain"
          className="p-6 sm:p-8 lg:col-span-2 lg:col-start-1 lg:row-start-3"
        >
          <CardHead
            step="3"
            badge={<IconBadge tint="peach">📋</IconBadge>}
            title="Your saved lunch plans"
          />

          <TableWrap className="mt-6">
            <table className="w-full min-w-[640px] text-left text-[15px]">
              <thead>
                <tr className="border-b border-leaf-100 text-[13px] text-leaf-500">
                  <th className="pb-3 pr-4 font-bold">Date</th>
                  <th className="pb-3 pr-4 font-bold">Child&apos;s age</th>
                  <th className="pb-3 pr-4 font-bold">Allergies</th>
                  <th className="pb-3 pr-4 font-bold">Preferences</th>
                  <th className="pb-3 pr-4 font-bold">Days</th>
                  <th className="pb-3 pr-4 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadingSaved && (
                  <tr>
                    <td colSpan={6} className="py-5 text-leaf-600">
                      Loading saved plans...
                    </td>
                  </tr>
                )}

                {!loadingSaved && savedPlans.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-5 text-leaf-600">
                      No saved plans yet — generate one above and click Save
                      plan.
                    </td>
                  </tr>
                )}

                {!loadingSaved &&
                  savedPlans.slice(0, visibleRows).map((row) => (
                    <Fragment key={row.id}>
                      <tr className="border-b border-leaf-100 align-middle text-leaf-800">
                        <td className="py-4 pr-4">
                          {new Date(row.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 pr-4">{row.child_age}</td>
                        <td className="py-4 pr-4">
                          {row.allergies.length > 0
                            ? row.allergies.join(", ")
                            : "None"}
                        </td>
                        <td className="py-4 pr-4">
                          {row.preferences.length > 0
                            ? row.preferences.join(", ")
                            : "None"}
                        </td>
                        <td className="py-4 pr-4">
                          {row.plan_json.length} days
                        </td>
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedId((prev) =>
                                  prev === row.id ? null : row.id,
                                )
                              }
                              className={BTN_ROW}
                            >
                              View
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(row.id)}
                              title="Delete plan"
                              className={BTN_ROW_DANGER}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedId === row.id && (
                        <tr className="border-b border-leaf-100 bg-leaf-50/70">
                          <td colSpan={6} className="px-3 py-4">
                            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                              {row.plan_json.map((meal) => (
                                <li
                                  key={meal.day}
                                  className="rounded-2xl bg-white p-3.5 text-[13px] text-leaf-700 shadow-sm"
                                >
                                  <p className="font-poppins font-bold text-leaf-900">
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
          </TableWrap>

          {!loadingSaved && savedPlans.length > 0 && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleRows((prev) => prev + 5)}
                disabled={visibleRows >= savedPlans.length}
                className={BTN_GHOST}
              >
                Load more
              </button>
            </div>
          )}
        </Card>
        {/* Section 4: Sidebar */}
        <Card
          tint="peach"
          className="h-fit p-6 sm:p-7 lg:col-start-2 lg:row-start-1"
        >
          <h2 className="font-poppins text-[26px] font-extrabold tracking-tight text-leaf-900">
            How it works
          </h2>
          <ol className="mt-4">
            {[
              <>
                Tell us your child&apos;s age, allergies, and food
                preferences.
              </>,
              <>
                We instantly generate a 5-day lunch plan, filtering out
                anything on the allergy list.
              </>,
              <>Save your favorite plan so you can find it again later.</>,
            ].map((copy, index) => {
              const Icon = HOW_ICONS[index];
              return (
                <li
                  key={index}
                  className={`flex items-center gap-3.5 py-4 ${
                    index > 0 ? "border-t border-peach-200/70" : "pt-1"
                  }`}
                >
                  <StepRing>{index + 1}</StepRing>
                  <Icon
                    className="h-6 w-6 shrink-0 text-peach-500"
                    aria-hidden="true"
                    strokeWidth={2}
                  />
                  <span className="text-[15px] leading-snug text-leaf-800">
                    {copy}
                  </span>
                </li>
              );
            })}
          </ol>
          <p className="mt-2 rounded-2xl bg-leaf-100/70 px-4 py-3.5 text-[13px] leading-relaxed text-leaf-700">
            🔒 Your plans are saved securely in our database.
          </p>
        </Card>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {VALUE_PROPS.map((prop, index) => {
          const tint = TINT[VALUE_PROP_TINTS[index % VALUE_PROP_TINTS.length]];
          return (
            <div
              key={prop.title}
              className={`rounded-[28px] border p-6 shadow-card ${tint.card}`}
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-2xl shadow-sm"
                aria-hidden="true"
              >
                {prop.icon}
              </span>
              <h2 className="mt-4 font-poppins text-[17px] font-extrabold text-leaf-900">
                {prop.title}
              </h2>
              <p className="mt-1.5 text-[14px] leading-snug text-leaf-700">
                {prop.description}
              </p>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
