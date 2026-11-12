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
import {
  Card,
  CardHead,
  HeroArt,
  HeroLabel,
  IconBadge,
  NoteTick,
  PageHero,
  PageShell,
  StatTile,
  StepPill,
  StickyNote,
  TableWrap,
  TagPill,
} from "@/components/ui/pieces";
import {
  BTN_GHOST,
  BTN_PRIMARY,
  BTN_SECONDARY,
  FIELD,
  CARD_SUBTITLE,
  FIELD_LABEL,
  TINT,
  type TintName,
} from "@/components/ui/theme";

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

/** Pastel tint per KPI card, left to right, matching the redesign. */
const KPI_TINTS: TintName[] = ["green", "cream", "pink", "blue"];

/** Pastel tint per global example card, cycled so the grid stays varied. */
const EXAMPLE_TINTS: TintName[] = ["green", "cream", "blue", "pink", "peach"];

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
      <label className={FIELD_LABEL}>
        {label}
      </label>
      <select
        value={isOther ? "Other" : value}
        onChange={(e) => handleSelectChange(e.target.value)}
        className={`${FIELD} mt-2`}
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
          className={`${FIELD} mt-2`}
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
    <PageShell>
      <PageHero
        label={
          <HeroLabel badge={<IconBadge tint="peach" size="lg">🔍</IconBadge>}>
            Research
          </HeroLabel>
        }
        title={
          <>
            Research &amp; <span className="text-peach-500">Benchmarking</span>
          </>
        }
        subtitle={
          <>
            This page shows why Lunchies matters: real proof that parents
            need this, who else is trying to solve it, and where we can do
            better.
          </>
        }
        art={
          <HeroArt
            src="/images/redesign/hero-research.webp"
            width={580}
            height={524}
            tone="leaf"
            priority
            glyph="🔎"
            note={
              <StickyNote>
                <span className="flex flex-col gap-1.5">
                  <NoteTick>Market insights</NoteTick>
                  <NoteTick>Competitors</NoteTick>
                  <NoteTick>Risks</NoteTick>
                  <NoteTick>Opportunities</NoteTick>
                </span>
              </StickyNote>
            }
          />
        }
      />

      {/* KPI widget */}
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {KPI_CARDS.map((kpi, index) => (
          <StatTile
            key={kpi.label}
            tint={KPI_TINTS[index % KPI_TINTS.length]}
            icon={kpi.icon}
            value={kpi.value}
            label={kpi.label}
          />
        ))}
      </div>

      {/* Reading guide — the mockup's chip row. Same four steps, same words,
          each one now scrolling to the section it names. */}
      <nav className="mt-6 flex flex-wrap items-stretch justify-center gap-2.5">
        <a
          href="#mexico"
          className="flex items-center gap-2.5 rounded-2xl border border-leaf-100/70 bg-gradient-to-b from-[#eff8f1] to-[#e3f1e7] px-4 py-3 text-[13px] font-bold leading-snug text-leaf-800 shadow-card transition-transform hover:-translate-y-0.5"
        >
          <StepPill size="sm">1</StepPill>
          See if the problem is real{" "}
          <span className="font-semibold text-leaf-500">(Mexico stat)</span>
        </a>
        <span
          aria-hidden="true"
          className="hidden self-center px-0.5 text-peach-400 lg:block"
        >
          →
        </span>
        <a
          href="#competitors"
          className="flex items-center gap-2.5 rounded-2xl border border-cream-200/70 bg-gradient-to-b from-[#fdf6ea] to-[#fbeeda] px-4 py-3 text-[13px] font-bold leading-snug text-leaf-800 shadow-card transition-transform hover:-translate-y-0.5"
        >
          <StepPill size="sm">2</StepPill>
          See who else is solving it{" "}
          <span className="font-semibold text-leaf-500">
            (global examples + competitors)
          </span>
        </a>
        <span
          aria-hidden="true"
          className="hidden self-center px-0.5 text-peach-400 lg:block"
        >
          →
        </span>
        <a
          href="#risk-map"
          className="flex items-center gap-2.5 rounded-2xl border border-rose-100/70 bg-gradient-to-b from-[#fdeff1] to-[#fbe4e8] px-4 py-3 text-[13px] font-bold leading-snug text-leaf-800 shadow-card transition-transform hover:-translate-y-0.5"
        >
          <StepPill size="sm">3</StepPill>
          See how risky each one is{" "}
          <span className="font-semibold text-leaf-500">(risk map)</span>
        </a>
        <span
          aria-hidden="true"
          className="hidden self-center px-0.5 text-peach-400 lg:block"
        >
          →
        </span>
        <a
          href="#save-research"
          className="flex items-center gap-2.5 rounded-2xl border border-sky-100/70 bg-gradient-to-b from-[#eef5fd] to-[#e2edfb] px-4 py-3 text-[13px] font-bold leading-snug text-leaf-800 shadow-card transition-transform hover:-translate-y-0.5"
        >
          <StepPill size="sm">4</StepPill>
          Save what you learned
        </a>
      </nav>

      <div className="mt-10 space-y-6">
        {/* Section 1: Intake form */}
        <Card tint="green" className="p-6 sm:p-8">
          <CardHead
            step="1"
            badge={<IconBadge tint="green">📝</IconBadge>}
            title="Research intake"
            subtitle={
              <>
                Use this form to write down exactly what you&apos;re trying to
                find out before you start researching — like a mini research
                plan.
              </>
            }
          />

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
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
            <span className={FIELD_LABEL}>
              What do you want to learn?
            </span>
            <div className="mt-3 flex flex-wrap gap-2">
              {LEARNING_TAGS.map((tag) => {
                const active = tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setTags((prev) => toggleTag(prev, tag))}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition-colors ${
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

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleStartResearch}
              className={`${BTN_PRIMARY} px-9 text-base`}
            >
              Start research
            </button>
            <button
              type="button"
              onClick={handleResetForm}
              className={BTN_GHOST}
            >
              Reset form
            </button>
          </div>
          <p className="mt-4 rounded-2xl bg-white/80 px-4 py-3 text-xs text-leaf-600 shadow-sm">
            This won&apos;t fetch new data — it just organizes your research
            focus so the sections below make more sense.
          </p>
        </Card>

        {/* Section 2: Global examples */}
        <Card tint="plain" className="p-6 sm:p-8">
          <CardHead
            step="2"
            badge={<IconBadge tint="blue">🌍</IconBadge>}
            title="Global examples"
            action={
              <a
                href="#competitors"
                className="shrink-0 rounded-full bg-peach-50 px-4 py-2 text-sm font-bold text-peach-600 transition-colors hover:bg-peach-100"
              >
                See more examples →
              </a>
            }
          />
          {/* Kept outside CardHead so it stays after the link, as before. */}
          <p className={CARD_SUBTITLE}>
            These are companies in other countries already doing something
            similar to Lunchies. We study them to see what works well and
            what we could do differently.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GLOBAL_EXAMPLES.map((example, index) => {
              const tint = TINT[EXAMPLE_TINTS[index % EXAMPLE_TINTS.length]];
              return (
                <div
                  key={example.name}
                  className={`rounded-2xl border p-5 shadow-sm ${tint.card}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-poppins font-bold text-leaf-900">
                      {example.name}
                    </h3>
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-leaf-600 shadow-sm">
                      <span aria-hidden="true">
                        {COUNTRY_FLAGS[example.country]}
                      </span>
                      {example.country}
                    </span>
                  </div>
                  <p className="mt-2.5 text-sm text-leaf-700">
                    {example.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Section 3: Mexico context */}
        <Card id="mexico" tint="peach" className="scroll-mt-24 p-6 sm:p-8">
          <CardHead
            step="3"
            stepTone="peach"
            badge={<IconBadge tint="peach">🇲🇽</IconBadge>}
            title="Mexico"
          />

          <div className="mt-6 flex flex-col items-start gap-3 rounded-2xl bg-white/70 p-5 shadow-sm sm:flex-row sm:items-center sm:gap-6">
            <span className="font-poppins text-5xl font-extrabold text-peach-600 sm:text-6xl">
              {MEXICO_STAT.value}
            </span>
            <p className="text-sm text-peach-800">{MEXICO_STAT.label}</p>
          </div>
          <p className="mt-3 text-xs text-peach-600">
            Fuente: {MEXICO_STAT.source}
          </p>
        </Card>

        {researchSummary && (
          <div className="flex items-start gap-3 rounded-3xl border border-peach-200 bg-peach-50 px-5 py-4 text-sm text-peach-800 shadow-soft">
            <span aria-hidden="true">🧭</span>
            <span>{researchSummary}</span>
          </div>
        )}

        {researchInsight && (
          <div className="flex items-start gap-3 rounded-3xl border border-leaf-200 bg-leaf-50 px-5 py-4 text-sm text-leaf-800 shadow-soft">
            <span aria-hidden="true">✨</span>
            <span>{researchInsight}</span>
          </div>
        )}

        {/* Section 4: Competitors table */}
        <Card id="competitors" tint="plain" className="scroll-mt-20 p-6 sm:p-8">
          <CardHead
            step="4"
            badge={<IconBadge tint="peach">📊</IconBadge>}
            title="Competitors & substitutes"
            subtitle={
              <>
                Companies and alternatives that parents in Mexico already use
                today, compared side by side to find where Lunchies can stand
                out.
              </>
            }
          />
          <p className="mt-3 rounded-2xl bg-cream-100 px-4 py-3 text-sm text-leaf-600">
            Not everyone competing with Lunchies looks the same. Some offer
            almost the exact same thing (we call these Direct competitors).
            Others solve the same problem in a different way, like a
            supermarket selling ready meals (Indirect). And some parents just
            solve it themselves, like making lunch at home or buying from the
            school cafeteria (Substitutes).
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name..."
              className={`${FIELD} sm:max-w-xs`}
            />
            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value as CompetitorType | "All")
              }
              className={`${FIELD} sm:w-auto`}
            >
              <option value="All">All types</option>
              <option value="Direct">Direct</option>
              <option value="Indirect">Indirect</option>
              <option value="Substitute">Substitute</option>
            </select>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className={`${FIELD} sm:w-auto`}
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
              className={`${BTN_GHOST} shrink-0`}
            >
              Reset filters
            </button>
          </div>

          <TableWrap className="mt-5">
            <table className="w-full min-w-[720px] text-left text-[14px]">
              <thead>
                <tr className="border-b border-leaf-100 text-[13px] text-leaf-600">
                  <th
                    onClick={() => handleSortClick("name")}
                    className="cursor-pointer select-none pb-3 pr-4 font-bold transition-colors hover:text-leaf-800"
                  >
                    Name{" "}
                    {sortColumn === "name" && (
                      <span aria-hidden="true">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th className="pb-3 pr-4 font-bold">Type</th>
                  <th className="pb-3 pr-4 font-bold">Country</th>
                  <th
                    onClick={() => handleSortClick("price")}
                    className="cursor-pointer select-none pb-3 pr-4 font-bold transition-colors hover:text-leaf-800"
                  >
                    Price (weekly){" "}
                    {sortColumn === "price" && (
                      <span aria-hidden="true">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th className="pb-3 pr-4 font-bold">Strength</th>
                  <th className="pb-3 pr-4 font-bold">Weakness</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompetitors.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-5 text-leaf-600">
                      No competitors match your search — try a different
                      name, type, or country.
                    </td>
                  </tr>
                )}
                {filteredCompetitors.map((c) => {
                  const highlighted = isRelevantRow(c, appliedTags);
                  const cellBorder = highlighted
                    ? "border-y-2 border-peach-400"
                    : "border-b border-leaf-100";
                  return (
                    <tr
                      key={c.name}
                      className="align-middle text-leaf-800 transition-colors hover:bg-leaf-50/60"
                    >
                      <td
                        className={`py-3.5 pr-4 font-bold ${cellBorder} ${
                          highlighted ? "border-l-2 border-peach-400" : ""
                        }`}
                      >
                        <span aria-hidden="true">{COMPETITOR_EMOJIS[c.name]}</span>{" "}
                        {c.name}
                      </td>
                      <td className={`py-3.5 pr-4 ${cellBorder}`}>
                        <TagPill
                          className="text-white shadow-sm"
                          style={{ backgroundColor: TYPE_COLORS[c.type] }}
                        >
                          {c.type}
                        </TagPill>
                      </td>
                      <td className={`py-3.5 pr-4 ${cellBorder}`}>
                        {c.country}
                      </td>
                      <td className={`py-3.5 pr-4 font-bold ${cellBorder}`}>
                        {c.price}
                      </td>
                      <td className={`py-3.5 pr-4 ${cellBorder}`}>
                        {c.strength}
                      </td>
                      <td
                        className={`py-3.5 pr-4 ${cellBorder} ${
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
          </TableWrap>
        </Card>

        {/* Section 5: Risk map */}
        <Card id="risk-map" tint="green" className="scroll-mt-24 p-6 sm:p-8">
          <CardHead
            step="5"
            badge={<IconBadge tint="green">🗺️</IconBadge>}
            title="Risk map"
            subtitle={
              <>
                This chart helps us see, at a glance, which competitors we
                should worry about most. Competitors on the right are used by
                a lot of people already (crowded market). Competitors near the
                top are the ones most similar and dangerous to Lunchies. The
                bottom-left is the safest zone — and that&apos;s where
                Lunchies sits today.
              </>
            }
          />
          <div className="mt-6 rounded-2xl bg-white/70 p-4 shadow-sm sm:p-6">
            <RiskMap competitors={COMPETITORS} />
          </div>
        </Card>
        {/* Section 6: The gap */}
        <Card tint="peach" className="p-6 sm:p-8">
          <CardHead
            step="6"
            stepTone="peach"
            badge={<IconBadge tint="peach">🎯</IconBadge>}
            title="So, what's the gap?"
          />
          <p className="mt-5 rounded-2xl bg-white/70 p-5 text-sm text-peach-800 shadow-sm">
            Parents in Mexico really do struggle with this — over a third of
            school-age kids already face weight-related health issues.
            Several companies compete on price or convenience, but none
            combine personalization, allergy-safety, and affordability the
            way Lunchies does. That&apos;s the gap Lunchies is built to fill.
          </p>
        </Card>

        {/* Section 7: Save research */}
        <Card id="save-research" tint="plain" className="scroll-mt-24 p-6 sm:p-8">
          <CardHead
            step="7"
            badge={<IconBadge tint="green">💾</IconBadge>}
            title="Save your research"
            subtitle={
              <>
                Once you&apos;ve reviewed everything above, save a short
                summary of what you learned so you (or your team) can find it
                again later.
              </>
            }
          />

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave || saving}
              className={BTN_SECONDARY}
            >
              {saving ? "Saving..." : "Save research summary"}
            </button>
            {!canSave && (
              <span className="text-xs text-leaf-600">
                Fill in topic, problem, target user and location above to save.
              </span>
            )}
            {saveMessage && (
              <span className="text-sm font-semibold text-leaf-700">
                {saveMessage}
              </span>
            )}
          </div>

          <h3 className="mt-8 font-poppins text-sm font-bold text-leaf-800">
            Previously saved research
          </h3>
          <TableWrap className="mt-4">
            <table className="w-full min-w-[640px] text-left text-[14px]">
              <thead>
                <tr className="border-b border-leaf-100 text-[13px] text-leaf-600">
                  <th className="pb-3 pr-4 font-bold">Date</th>
                  <th className="pb-3 pr-4 font-bold">Topic</th>
                  <th className="pb-3 pr-4 font-bold">Target user</th>
                  <th className="pb-3 pr-4 font-bold">Location</th>
                  <th className="pb-3 pr-4 font-bold">Tags</th>
                </tr>
              </thead>
              <tbody>
                {loadingSaved && (
                  <tr>
                    <td colSpan={5} className="py-5 text-leaf-600">
                      Loading saved research...
                    </td>
                  </tr>
                )}
                {!loadingSaved && savedNotes.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-5 text-leaf-600">
                      No saved research yet — fill out the form above and
                      click Save research summary.
                    </td>
                  </tr>
                )}
                {!loadingSaved &&
                  savedNotes.map((note) => (
                    <tr
                      key={note.id}
                      className="align-middle text-leaf-800 transition-colors hover:bg-leaf-50/60"
                    >
                      <td className="border-b border-leaf-100 py-3.5 pr-4">
                        {new Date(note.created_at).toLocaleDateString()}
                      </td>
                      <td className="border-b border-leaf-100 py-3.5 pr-4 font-bold">
                        {note.topic}
                      </td>
                      <td className="border-b border-leaf-100 py-3.5 pr-4">
                        {note.target_user}
                      </td>
                      <td className="border-b border-leaf-100 py-3.5 pr-4">
                        {note.location}
                      </td>
                      <td className="border-b border-leaf-100 py-3.5 pr-4">
                        {note.tags && note.tags.length > 0
                          ? note.tags.join(", ")
                          : "None"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </TableWrap>
        </Card>
      </div>
    </PageShell>
  );
}
