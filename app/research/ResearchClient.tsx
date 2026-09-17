"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  COMPETITORS,
  COUNTRY_FLAGS,
  GLOBAL_EXAMPLES,
  LEARNING_TAGS,
  MEXICO_STAT,
  TYPE_COLORS,
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

export default function ResearchClient() {
  const [topic, setTopic] = useState("");
  const [problem, setProblem] = useState("");
  const [targetUser, setTargetUser] = useState("");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<CompetitorType | "All">("All");
  const [countryFilter, setCountryFilter] = useState<string>("All");

  const countryOptions = useMemo(
    () => ["All", ...Array.from(new Set(COMPETITORS.map((c) => c.country)))],
    [],
  );

  const filteredCompetitors = useMemo(() => {
    const query = search.trim().toLowerCase();
    return COMPETITORS.filter((c) => {
      const matchesSearch = query ? c.name.toLowerCase().includes(query) : true;
      const matchesType = typeFilter === "All" ? true : c.type === typeFilter;
      const matchesCountry =
        countryFilter === "All" ? true : c.country === countryFilter;
      return matchesSearch && matchesType && matchesCountry;
    });
  }, [search, typeFilter, countryFilter]);

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
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-800 sm:text-4xl">
            Research &{" "}
            <span className="text-peach-500">benchmarking dashboard</span>
          </h1>
          <p className="mt-4 max-w-md text-lg text-gray-600">
            This page shows why Lunchies matters: real proof that parents
            need this, who else is trying to solve it, and where we can do
            better.
          </p>
        </div>
        <div className="flex justify-center md:justify-end">
          <span className="text-[8rem] leading-none" aria-hidden="true">
            🔎
          </span>
        </div>
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
            <div>
              <label className="block text-sm font-medium text-leaf-800">
                Research topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Personalized allergy-friendly lunches"
                className="mt-2 w-full rounded-lg border border-leaf-200 bg-white px-3 py-2 text-sm text-leaf-900 focus:border-leaf-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-leaf-800">
                Target user
              </label>
              <input
                type="text"
                value={targetUser}
                onChange={(e) => setTargetUser(e.target.value)}
                placeholder="e.g. Busy parents of school-age kids"
                className="mt-2 w-full rounded-lg border border-leaf-200 bg-white px-3 py-2 text-sm text-leaf-900 focus:border-leaf-500 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-leaf-800">
                Problem to validate
              </label>
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                rows={3}
                placeholder="What problem are you trying to confirm exists?"
                className="mt-2 w-full rounded-lg border border-leaf-200 bg-white px-3 py-2 text-sm text-leaf-900 focus:border-leaf-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-leaf-800">
                Location / market
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Mexico City"
                className="mt-2 w-full rounded-lg border border-leaf-200 bg-white px-3 py-2 text-sm text-leaf-900 focus:border-leaf-500 focus:outline-none"
              />
            </div>
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
        </div>

        {/* Section 2: Global examples */}
        <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-sm font-bold text-white">
              2
            </span>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-leaf-700">
              <span aria-hidden="true">🌍</span> Global examples
            </h2>
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

        {/* Section 4: Competitors table */}
        <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm">
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
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-leaf-100 text-leaf-600">
                  <th className="py-2 pr-4 font-medium">Name</th>
                  <th className="py-2 pr-4 font-medium">Type</th>
                  <th className="py-2 pr-4 font-medium">Country</th>
                  <th className="py-2 pr-4 font-medium">Price (weekly)</th>
                  <th className="py-2 pr-4 font-medium">Strength</th>
                  <th className="py-2 pr-4 font-medium">Weakness</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompetitors.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-4 text-leaf-600">
                      No competitors match your search or filters.
                    </td>
                  </tr>
                )}
                {filteredCompetitors.map((c) => (
                  <tr
                    key={c.name}
                    className="border-b border-leaf-50 align-top text-leaf-800"
                  >
                    <td className="py-3 pr-4 font-medium">{c.name}</td>
                    <td className="py-3 pr-4">
                      <span
                        className="rounded-full px-2.5 py-1 text-xs font-semibold text-white"
                        style={{ backgroundColor: TYPE_COLORS[c.type] }}
                      >
                        {c.type}
                      </span>
                    </td>
                    <td className="py-3 pr-4">{c.country}</td>
                    <td className="py-3 pr-4">{c.price}</td>
                    <td className="py-3 pr-4">{c.strength}</td>
                    <td className="py-3 pr-4">{c.weakness}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 5: Risk map */}
        <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm">
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

        {/* Section 6: Save research */}
        <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-sm font-bold text-white">
              6
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
