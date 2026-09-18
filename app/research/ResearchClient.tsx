"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  COMPETITOR_EMOJIS,
  COMPETITORS,
  COUNTRY_FLAGS,
  GLOBAL_EXAMPLES,
  LEARNING_TAGS,
  MEXICO_STAT,
  TYPE_COLORS,
  type Competitor,
  type CompetitorType,
} from "@/lib/researchData";
import RiskMap from "@/components/RiskMap";

type SavedNote = {
  id: string;
  created_at: string;
  topic: string;
  problem: string;
  target_user: string;
  location: string;
  tags: string[];
};

function toggleTag(list: string[], tag: string) {
  return list.includes(tag)
    ? list.filter((item) => item !== tag)
    : [...list, tag];
}

function getLowPrice(price: string): number {
  const match = price.match(/\d+/);
  return match ? parseInt(match[0], 10) : Infinity;
}

function isRelevantRow(c: Competitor, appliedTags: string[]): boolean {
  const text = `${c.strength} ${c.weakness}`.toLowerCase();
  if (appliedTags.includes("Allergies") && text.includes("allerg")) {
    return true;
  }
  if (
    appliedTags.includes("Distribution") &&
    (text.includes("available") || text.includes("convenient"))
  ) {
    return true;
  }
  return false;
}

function buildResearchSummary(
  topic: string,
  problem: string,
  targetUser: string,
  location: string,
  tags: string[],
): string {
  const clauses: string[] = [];

  const opening = topic ? `You're researching ${topic}` : "You're researching this";
  clauses.push(opening);

  if (problem) {
    clauses.push(`to find out if '${problem}' is true`);
  }

  const audience: string[] = [];
  if (targetUser) audience.push(`for ${targetUser}`);
  if (location) audience.push(`in ${location}`);
  if (audience.length > 0) {
    clauses.push(audience.join(" "));
  }

  let summary = `${clauses.join(" ")}.`;

  if (tags.length > 0) {
    summary += ` You want to learn about: ${tags.join(", ")}.`;
  }

  return summary;
}

function getPriceBounds(price: string): [number, number] {
  const numbers = price.match(/\d+/g)?.map(Number) ?? [];
  if (numbers.length === 0) return [Infinity, Infinity];
  return [Math.min(...numbers), Math.max(...numbers)];
}

const TOTAL_COMPETITORS_COUNT = COMPETITORS.length;
const DIRECT_COMPETITORS_COUNT = COMPETITORS.filter(
  (c) => c.type === "Direct",
).length;
const ALL_PRICE_BOUNDS = COMPETITORS.map((c) => getPriceBounds(c.price));
const MIN_COMPETITOR_PRICE = Math.min(
  ...ALL_PRICE_BOUNDS.map(([low]) => low),
);
const MAX_COMPETITOR_PRICE = Math.max(
  ...ALL_PRICE_BOUNDS.map(([, high]) => high),
);

const KPI_CARDS = [
  {
    icon: "📊",
    value: `${TOTAL_COMPETITORS_COUNT}`,
    label: "competitors tracked",
  },
  {
    icon: "🎯",
    value: `${DIRECT_COMPETITORS_COUNT}`,
    label: "direct competitors",
  },
  {
    icon: "💰",
    value: `$${MIN_COMPETITOR_PRICE}–$${MAX_COMPETITOR_PRICE}`,
    label: "price range /week",
  },
  {
    icon: "🔍",
    value: "1",
    label: "clear gap identified",
  },
];

function buildResearchInsight(topic: string, tags: string[]): string {
  const directCompetitors = COMPETITORS.filter((c) => c.type === "Direct");
  const directLows = directCompetitors.map((c) => getPriceBounds(c.price)[0]);
  const directHighs = directCompetitors.map((c) => getPriceBounds(c.price)[1]);
  const minPrice = Math.min(...directLows);
  const maxPrice = Math.max(...directHighs);

  const sentences: string[] = [
    `there are ${directCompetitors.length} direct competitors in this space, with prices ranging from $${minPrice} to $${maxPrice}/week`,
  ];

  const wantsAllergyInsight =
    topic.toLowerCase().includes("allerg") || tags.includes("Allergies");
  if (wantsAllergyInsight) {
    const allergyCompetitors = COMPETITORS.filter(
      (c) => c.name !== "Lunchies" && /allerg/i.test(c.strength),
    ).length;
    sentences.push(
      allergyCompetitors === 0
        ? "None of them combine allergy-safety with personalization — that's the gap Lunchies fills"
        : `Only ${allergyCompetitors} of them mention allergy-safety as a strength — most still don't combine it with personalization`,
    );
  }

  const wantsPricingInsight =
    topic.toLowerCase().includes("pricing") || tags.includes("Pricing");
  if (wantsPricingInsight) {
    const midpoints = COMPETITORS.map((c) => {
      const [low, high] = getPriceBounds(c.price);
      return (low + high) / 2;
    });
    const average = Math.round(
      midpoints.reduce((sum, value) => sum + value, 0) / midpoints.length,
    );
    sentences.push(
      `On average, competitors charge around $${average}/week — useful context for pricing Lunchies`,
    );
  }

  sentences.push(
    `Given that ${MEXICO_STAT.value} of school-age children in Mexico face weight-related health issues, this problem is backed by real data`,
  );

  return `Based on your research: ${sentences.join(". ")}.`;
}

const TOPIC_OPTIONS = [
  "Allergy-friendly lunches",
  "Pricing",
  "Personalization",
  "Delivery speed",
  "Nutrition quality",
  "Convenience",
  "Other",
];

const PROBLEM_OPTIONS = [
  "Parents don't have time to prepare lunch",
  "Parents worry about allergies/safety",
  "Existing options are too expensive",
  "Existing options aren't personalized",
  "Parents don't trust delivery quality",
  "Other",
];

const TARGET_USER_OPTIONS = [
  "Parents of children ages 3-5",
  "Parents of children ages 6-12",
  "Parents of teenagers",
  "Schools / institutions",
  "Other",
];

const LOCATION_OPTIONS = ["Mexico City", "Guadalajara", "Monterrey", "Other"];

function SelectWithOther({
  label,
  options,
  value,
  onChange,
  otherPlaceholder,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  otherPlaceholder: string;
}) {
  const [isOther, setIsOther] = useState(false);

  function handleSelectChange(newValue: string) {
    if (newValue === "Other") {
      setIsOther(true);
      onChange("");
    } else {
      setIsOther(false);
      onChange(newValue);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-leaf-800">
        {label}
      </label>
      <select
        value={isOther ? "Other" : value}
        onChange={(e) => handleSelectChange(e.target.value)}
        className="mt-2 w-full rounded-lg border border-leaf-200 bg-white px-3 py-2 text-sm text-leaf-900 focus:border-leaf-500 focus:outline-none"
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {isOther && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={otherPlaceholder}
          className="mt-2 w-full rounded-lg border border-leaf-200 bg-white px-3 py-2 text-sm text-leaf-900 focus:border-leaf-500 focus:outline-none"
        />
      )}
    </div>
  );
}

export default function ResearchClient() {
  const [topic, setTopic] = useState("");
  const [problem, setProblem] = useState("");
  const [targetUser, setTargetUser] = useState("");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [formResetKey, setFormResetKey] = useState(0);

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<CompetitorType | "All">("All");
  const [countryFilter, setCountryFilter] = useState<string>("All");

  const [researchSummary, setResearchSummary] = useState<string | null>(null);
  const [researchInsight, setResearchInsight] = useState<string | null>(null);
  const [appliedTags, setAppliedTags] = useState<string[]>([]);

  const [sortColumn, setSortColumn] = useState<"name" | "price" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const countryOptions = useMemo(
    () => ["All", ...Array.from(new Set(COMPETITORS.map((c) => c.country)))],
    [],
  );

  function handleSortClick(column: "name" | "price") {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  }

  const filteredCompetitors = useMemo(() => {
    const query = search.trim().toLowerCase();
    const matches = COMPETITORS.filter((c) => {
      const matchesSearch = query ? c.name.toLowerCase().includes(query) : true;
      const matchesType = typeFilter === "All" ? true : c.type === typeFilter;
      const matchesCountry =
        countryFilter === "All" ? true : c.country === countryFilter;
      return matchesSearch && matchesType && matchesCountry;
    });

    if (sortColumn) {
      return [...matches].sort((a, b) => {
        const comparison =
          sortColumn === "name"
            ? a.name.localeCompare(b.name)
            : getLowPrice(a.price) - getLowPrice(b.price);
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    if (appliedTags.includes("Pricing")) {
      return [...matches].sort(
        (a, b) => getLowPrice(a.price) - getLowPrice(b.price),
      );
    }

    return matches;
  }, [search, typeFilter, countryFilter, appliedTags, sortColumn, sortDirection]);

  async function loadSavedNotes() {
    setLoadingSaved(true);
    const { data, error } = await supabase
      .from("research_notes")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (!error && data) {
      setSavedNotes(data as SavedNote[]);
    }
    setLoadingSaved(false);
  }

  useEffect(() => {
    loadSavedNotes();
  }, []);

  const canSave = topic.trim() && problem.trim() && targetUser.trim() && location.trim();

  function handleStartResearch() {
    setResearchSummary(
      buildResearchSummary(topic, problem, targetUser, location, tags),
    );
    setResearchInsight(buildResearchInsight(topic, tags));
    setAppliedTags(tags);
    document
      .getElementById("competitors")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleResetFilters() {
    setSearch("");
    setTypeFilter("All");
    setCountryFilter("All");
    setAppliedTags([]);
    setSortColumn(null);
    setSortDirection("asc");
  }

  function handleResetForm() {
    setTopic("");
    setProblem("");
    setTargetUser("");
    setLocation("");
    setTags([]);
    setFormResetKey((key) => key + 1);
  }

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    setSaveMessage(null);

    const { error } = await supabase.from("research_notes").insert({
      topic,
      problem,
      target_user: targetUser,
      location,
      tags,
    });

    if (error) {
      setSaveMessage("Something went wrong saving your research. Try again.");
    } else {
      setSaveMessage("Research summary saved!");
      await loadSavedNotes();
    }
    setSaving(false);
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <div className="flex items-center gap-3">
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-peach-100 text-3xl"
              aria-hidden="true"
            >
              🔍
            </span>
            <span className="text-sm font-bold uppercase tracking-wide text-peach-500">
              Research
            </span>
          </div>
          <h1 className="mt-3 whitespace-nowrap text-3xl font-extrabold tracking-tight text-gray-800 sm:text-4xl">
            Research &amp; <span className="text-peach-500">Benchmarking</span>
          </h1>
          <p className="mt-4 max-w-md text-lg text-gray-600">
            This page shows why Lunchies matters: real proof that parents
            need this, who else is trying to solve it, and where we can do
            better.
          </p>
        </div>
        <div className="flex justify-center md:justify-end">
          <span className="text-6xl leading-none" aria-hidden="true">
            🔎
          </span>
        </div>
      </div>

      {/* KPI widget */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {KPI_CARDS.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-2xl border border-leaf-100 bg-leaf-50 p-4 text-center shadow-sm"
          >
            <span className="text-2xl" aria-hidden="true">
              {kpi.icon}
            </span>
            <p className="mt-1 text-xl font-extrabold text-leaf-800">
              {kpi.value}
            </p>
            <p className="text-xs text-leaf-600">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Reading guide */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-3 rounded-full border border-leaf-100 bg-leaf-50 px-4 py-3 text-center text-xs font-medium text-leaf-700 sm:text-sm">
        <span className="flex items-center gap-1.5">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-[10px] font-bold text-white">
            1
          </span>
          See if the problem is real{" "}
          <span className="text-leaf-500">(Mexico stat)</span>
        </span>
        <span aria-hidden="true" className="text-leaf-400">
          →
        </span>
        <span className="flex items-center gap-1.5">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-[10px] font-bold text-white">
            2
          </span>
          See who else is solving it{" "}
          <span className="text-leaf-500">
            (global examples + competitors)
          </span>
        </span>
        <span aria-hidden="true" className="text-leaf-400">
          →
        </span>
        <span className="flex items-center gap-1.5">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-[10px] font-bold text-white">
            3
          </span>
          See how risky each one is{" "}
          <span className="text-leaf-500">(risk map)</span>
        </span>
        <span aria-hidden="true" className="text-leaf-400">
          →
        </span>
        <span className="flex items-center gap-1.5">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-[10px] font-bold text-white">
            4
          </span>
          Save what you learned
        </span>
      </div>

      <div className="mt-12 space-y-8">
        {/* Section 1: Intake form */}
        <div className="rounded-2xl border border-leaf-100 bg-leaf-50 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-sm font-bold text-white">
              1
            </span>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-leaf-700">
              <span aria-hidden="true">📝</span> Research intake
            </h2>
          </div>
          <p className="mt-2 text-sm text-leaf-600">
            Use this form to write down exactly what you&apos;re trying to
            find out before you start researching — like a mini research
            plan.
          </p>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <SelectWithOther
              key={`topic-${formResetKey}`}
              label="Research topic"
              options={TOPIC_OPTIONS}
              value={topic}
              onChange={setTopic}
              otherPlaceholder="Describe your research topic"
            />
            <SelectWithOther
              key={`target-user-${formResetKey}`}
              label="Target user"
              options={TARGET_USER_OPTIONS}
              value={targetUser}
              onChange={setTargetUser}
              otherPlaceholder="Describe your target user"
            />
            <div className="sm:col-span-2">
              <SelectWithOther
                key={`problem-${formResetKey}`}
                label="Problem to validate"
                options={PROBLEM_OPTIONS}
                value={problem}
                onChange={setProblem}
                otherPlaceholder="Describe the problem you're trying to confirm"
              />
            </div>
            <SelectWithOther
              key={`location-${formResetKey}`}
              label="Location / market"
              options={LOCATION_OPTIONS}
              value={location}
              onChange={setLocation}
              otherPlaceholder="Describe your location or market"
            />
          </div>

          <div className="mt-6">
            <span className="block text-sm font-medium text-leaf-800">
              What do you want to learn?
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {LEARNING_TAGS.map((tag) => {
                const active = tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setTags((prev) => toggleTag(prev, tag))}
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

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleStartResearch}
              className="rounded-full bg-leaf-600 px-8 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-leaf-700"
            >
              Start research
            </button>
            <button
              type="button"
              onClick={handleResetForm}
              className="rounded-full border border-leaf-200 px-5 py-2.5 text-sm font-semibold text-leaf-700 transition-colors hover:bg-leaf-50"
            >
              Reset form
            </button>
          </div>
          <p className="mt-3 text-xs text-leaf-600">
            This won&apos;t fetch new data — it just organizes your research
            focus so the sections below make more sense.
          </p>
        </div>

        {/* Section 2: Global examples */}
        <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-sm font-bold text-white">
                2
              </span>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-leaf-700">
                <span aria-hidden="true">🌍</span> Global examples
              </h2>
            </div>
            <a
              href="#competitors"
              className="shrink-0 text-sm font-semibold text-peach-600 transition-colors hover:text-peach-700"
            >
              See more examples →
            </a>
          </div>
          <p className="mt-2 text-sm text-leaf-600">
            These are companies in other countries already doing something
            similar to Lunchies. We study them to see what works well and
            what we could do differently.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GLOBAL_EXAMPLES.map((example) => (
              <div
                key={example.name}
                className="rounded-xl border border-leaf-100 bg-leaf-50 p-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-leaf-800">
                    {example.name}
                  </h3>
                  <span className="flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-leaf-600">
                    <span aria-hidden="true">
                      {COUNTRY_FLAGS[example.country]}
                    </span>
                    {example.country}
                  </span>
                </div>
                <p className="mt-2 text-sm text-leaf-700">
                  {example.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Mexico context */}
        <div className="rounded-2xl border border-peach-100 bg-peach-50 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-peach-500 text-sm font-bold text-white">
              3
            </span>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-peach-700">
              <span aria-hidden="true">🇲🇽</span> Mexico
            </h2>
          </div>

          <div className="mt-5 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-5">
            <span className="text-4xl font-extrabold text-peach-600">
              {MEXICO_STAT.value}
            </span>
            <p className="text-sm text-peach-800">{MEXICO_STAT.label}</p>
          </div>
          <p className="mt-3 text-xs text-peach-600">
            Fuente: {MEXICO_STAT.source}
          </p>
        </div>

        {researchSummary && (
          <div className="flex items-start gap-2 rounded-xl border border-peach-200 bg-peach-50 px-4 py-3 text-sm text-peach-800">
            <span aria-hidden="true">🧭</span>
            <span>{researchSummary}</span>
          </div>
        )}

        {researchInsight && (
          <div className="flex items-start gap-2 rounded-xl border border-leaf-200 bg-leaf-50 px-4 py-3 text-sm text-leaf-800">
            <span aria-hidden="true">✨</span>
            <span>{researchInsight}</span>
          </div>
        )}

        {/* Section 4: Competitors table */}
        <div
          id="competitors"
          className="scroll-mt-20 rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-sm font-bold text-white">
              4
            </span>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-leaf-700">
              <span aria-hidden="true">📊</span> Competitors & substitutes
            </h2>
          </div>
          <p className="mt-2 text-sm text-leaf-600">
            Companies and alternatives that parents in Mexico already use
            today, compared side by side to find where Lunchies can stand
            out.
          </p>
          <p className="mt-1 text-sm text-leaf-500">
            Not everyone competing with Lunchies looks the same. Some offer
            almost the exact same thing (we call these Direct competitors).
            Others solve the same problem in a different way, like a
            supermarket selling ready meals (Indirect). And some parents just
            solve it themselves, like making lunch at home or buying from the
            school cafeteria (Substitutes).
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name..."
              className="w-full rounded-lg border border-leaf-200 bg-white px-3 py-2 text-sm text-leaf-900 focus:border-leaf-500 focus:outline-none sm:max-w-xs"
            />
            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value as CompetitorType | "All")
              }
              className="rounded-lg border border-leaf-200 bg-white px-3 py-2 text-sm text-leaf-900 focus:border-leaf-500 focus:outline-none"
            >
              <option value="All">All types</option>
              <option value="Direct">Direct</option>
              <option value="Indirect">Indirect</option>
              <option value="Substitute">Substitute</option>
            </select>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="rounded-lg border border-leaf-200 bg-white px-3 py-2 text-sm text-leaf-900 focus:border-leaf-500 focus:outline-none"
            >
              {countryOptions.map((country) => (
                <option key={country} value={country}>
                  {country === "All" ? "All countries" : country}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleResetFilters}
              className="rounded-lg border border-leaf-200 px-3 py-2 text-sm font-semibold text-leaf-700 transition-colors hover:bg-leaf-50"
            >
              Reset filters
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-leaf-100 text-leaf-600">
                  <th
                    onClick={() => handleSortClick("name")}
                    className="cursor-pointer select-none py-2 pr-4 font-medium hover:text-leaf-800"
                  >
                    Name{" "}
                    {sortColumn === "name" && (
                      <span aria-hidden="true">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th className="py-2 pr-4 font-medium">Type</th>
                  <th className="py-2 pr-4 font-medium">Country</th>
                  <th
                    onClick={() => handleSortClick("price")}
                    className="cursor-pointer select-none py-2 pr-4 font-medium hover:text-leaf-800"
                  >
                    Price (weekly){" "}
                    {sortColumn === "price" && (
                      <span aria-hidden="true">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th className="py-2 pr-4 font-medium">Strength</th>
                  <th className="py-2 pr-4 font-medium">Weakness</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompetitors.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-4 text-leaf-600">
                      No competitors match your search — try a different
                      name, type, or country.
                    </td>
                  </tr>
                )}
                {filteredCompetitors.map((c) => {
                  const highlighted = isRelevantRow(c, appliedTags);
                  const cellBorder = highlighted
                    ? "border-y-2 border-peach-400"
                    : "";
                  return (
                    <tr
                      key={c.name}
                      className="border-b border-leaf-50 align-top text-leaf-800"
                    >
                      <td
                        className={`py-3 pr-4 font-medium ${cellBorder} ${
                          highlighted ? "border-l-2 border-peach-400 pl-2" : ""
                        }`}
                      >
                        <span aria-hidden="true">{COMPETITOR_EMOJIS[c.name]}</span>{" "}
                        {c.name}
                      </td>
                      <td className={`py-3 pr-4 ${cellBorder}`}>
                        <span
                          className="rounded-full px-2.5 py-1 text-xs font-semibold text-white"
                          style={{ backgroundColor: TYPE_COLORS[c.type] }}
                        >
                          {c.type}
                        </span>
                      </td>
                      <td className={`py-3 pr-4 ${cellBorder}`}>
                        {c.country}
                      </td>
                      <td className={`py-3 pr-4 ${cellBorder}`}>{c.price}</td>
                      <td className={`py-3 pr-4 ${cellBorder}`}>
                        {c.strength}
                      </td>
                      <td
                        className={`py-3 pr-4 ${cellBorder} ${
                          highlighted ? "border-r-2 border-peach-400" : ""
                        }`}
                      >
                        {c.weakness}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 5: Risk map */}
        <div className="rounded-2xl border border-leaf-100 bg-leaf-50 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-sm font-bold text-white">
              5
            </span>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-leaf-700">
              <span aria-hidden="true">🗺️</span> Risk map
            </h2>
          </div>
          <p className="mt-2 text-sm text-leaf-600">
            This chart helps us see, at a glance, which competitors we should
            worry about most. Competitors on the right are used by a lot of
            people already (crowded market). Competitors near the top are the
            ones most similar and dangerous to Lunchies. The bottom-left is
            the safest zone — and that&apos;s where Lunchies sits today.
          </p>
          <div className="mt-5">
            <RiskMap competitors={COMPETITORS} />
          </div>
        </div>

        {/* Section 6: The gap */}
        <div className="rounded-2xl border border-peach-100 bg-peach-50 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-peach-500 text-sm font-bold text-white">
              6
            </span>
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-peach-100 text-2xl"
              aria-hidden="true"
            >
              🎯
            </span>
            <h2 className="text-lg font-semibold text-peach-700">
              So, what&apos;s the gap?
            </h2>
          </div>
          <p className="mt-3 text-sm text-peach-800">
            Parents in Mexico really do struggle with this — over a third of
            school-age kids already face weight-related health issues.
            Several companies compete on price or convenience, but none
            combine personalization, allergy-safety, and affordability the
            way Lunchies does. That&apos;s the gap Lunchies is built to fill.
          </p>
        </div>

        {/* Section 7: Save research */}
        <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-sm font-bold text-white">
              7
            </span>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-leaf-700">
              <span aria-hidden="true">💾</span> Save your research
            </h2>
          </div>
          <p className="mt-2 text-sm text-leaf-600">
            Once you&apos;ve reviewed everything above, save a short summary
            of what you learned so you (or your team) can find it again
            later.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave || saving}
              className="rounded-full bg-peach-500 px-6 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-peach-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save research summary"}
            </button>
            {!canSave && (
              <span className="text-xs text-leaf-600">
                Fill in topic, problem, target user and location above to save.
              </span>
            )}
            {saveMessage && (
              <span className="text-sm font-medium text-leaf-700">
                {saveMessage}
              </span>
            )}
          </div>

          <h3 className="mt-8 text-sm font-semibold text-leaf-700">
            Previously saved research
          </h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-leaf-100 text-leaf-600">
                  <th className="py-2 pr-4 font-medium">Date</th>
                  <th className="py-2 pr-4 font-medium">Topic</th>
                  <th className="py-2 pr-4 font-medium">Target user</th>
                  <th className="py-2 pr-4 font-medium">Location</th>
                  <th className="py-2 pr-4 font-medium">Tags</th>
                </tr>
              </thead>
              <tbody>
                {loadingSaved && (
                  <tr>
                    <td colSpan={5} className="py-4 text-leaf-600">
                      Loading saved research...
                    </td>
                  </tr>
                )}
                {!loadingSaved && savedNotes.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-4 text-leaf-600">
                      No saved research yet — fill out the form above and
                      click Save research summary.
                    </td>
                  </tr>
                )}
                {!loadingSaved &&
                  savedNotes.map((note) => (
                    <tr
                      key={note.id}
                      className="border-b border-leaf-50 align-top text-leaf-800"
                    >
                      <td className="py-3 pr-4">
                        {new Date(note.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 pr-4">{note.topic}</td>
                      <td className="py-3 pr-4">{note.target_user}</td>
                      <td className="py-3 pr-4">{note.location}</td>
                      <td className="py-3 pr-4">
                        {note.tags && note.tags.length > 0
                          ? note.tags.join(", ")
                          : "None"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
