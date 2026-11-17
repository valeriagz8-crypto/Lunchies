/**
 * Regenerates the build log in lib/week6Data.ts from `git log`.
 *
 * Run it with `npm run build-log` after committing. Every hash, subject,
 * date and count it writes comes from the repository history, so the log on
 * /docs can never drift from what was actually committed.
 *
 * Commits are grouped into the weeks of the course by date: each commit
 * belongs to the last week that had started when it was made.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const TARGET = new URL("../lib/week6Data.ts", import.meta.url);
const START = "/* build-log:start */";
const END = "/* build-log:end */";

/** The week each stretch of work belongs to, by the date it started. */
const WEEKS = [
  { week: "Week 0", title: "Project setup", from: "2026-08-20" },
  { week: "Week 1", title: "Generative Core Agent (/core)", from: "2026-09-01" },
  { week: "Week 2", title: "Research + Benchmarking (/research)", from: "2026-09-17" },
  { week: "Week 3", title: "Product & Pricing (/product, /pricing)", from: "2026-10-06" },
  { week: "Week 4", title: "Marketing Engine (/marketing)", from: "2026-10-28" },
  { week: "Week 5", title: "Public Chatbot (/chat)", from: "2026-11-01" },
  {
    week: "Week 6",
    title: "Redesign, /demo, /dashboard, regression test, user test",
    from: "2026-11-11",
  },
];

const log = execFileSync(
  "git",
  ["log", "--reverse", "--date=short", "--format=%h%x09%ad%x09%s"],
  { encoding: "utf8" },
)
  .trim()
  .split("\n")
  .map((line) => {
    const [hash, date, ...rest] = line.split("\t");
    return { hash, date, subject: rest.join("\t") };
  });

const weeks = WEEKS.map((w) => ({ ...w, commits: [] }));
for (const commit of log) {
  let bucket = weeks[0];
  for (const w of weeks) if (commit.date >= w.from) bucket = w;
  bucket.commits.push(commit);
}

const indent = (depth) => " ".repeat(depth);
const body = weeks
  .filter((w) => w.commits.length > 0)
  .map((w) => {
    const dates = w.commits.map((c) => c.date);
    const first = dates[0];
    const last = dates[dates.length - 1];
    const range = first === last ? first : `${first} to ${last}`;
    const commits = w.commits
      .map(
        (c) =>
          `${indent(6)}{\n` +
          `${indent(8)}hash: ${JSON.stringify(c.hash)},\n` +
          `${indent(8)}subject: ${JSON.stringify(c.subject)},\n` +
          `${indent(8)}date: ${JSON.stringify(c.date)}\n` +
          `${indent(6)}}`,
      )
      .join(",\n");
    return (
      `${indent(2)}{\n` +
      `${indent(4)}week: ${JSON.stringify(w.week)},\n` +
      `${indent(4)}title: ${JSON.stringify(w.title)},\n` +
      `${indent(4)}range: ${JSON.stringify(range)},\n` +
      `${indent(4)}commits: [\n${commits}\n${indent(4)}]\n` +
      `${indent(2)}}`
    );
  })
  .join(",\n");

const block =
  `${START}\n` +
  `export const BUILD_LOG: BuildLogWeek[] = [\n${body}\n];\n\n` +
  `export const BUILD_LOG_TOTAL = ${log.length};\n` +
  `${END}`;

const source = readFileSync(TARGET, "utf8");
const from = source.indexOf(START);
const to = source.indexOf(END);
if (from === -1 || to === -1) {
  throw new Error(`Markers ${START} / ${END} not found in lib/week6Data.ts`);
}
writeFileSync(TARGET, source.slice(0, from) + block + source.slice(to + END.length));

console.log(`build log: ${log.length} commits across ${weeks.filter((w) => w.commits.length).length} weeks`);
