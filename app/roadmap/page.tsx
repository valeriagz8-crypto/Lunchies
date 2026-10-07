const phases = [
  {
    title: "Phase 1: Pre-launch",
    period: "Months 1-2",
    items: [
      "Website development",
      "Health permits",
      "Hiring key staff",
      "Pilot tests",
    ],
  },
  {
    title: "Phase 2: Launch",
    period: "Months 3-6",
    items: [
      "Start of operations",
      "Digital campaigns",
      "School partnerships",
      "Referral program",
    ],
  },
  {
    title: "Phase 3: Growth",
    period: "Months 7-12",
    items: ["Expansion to more schools", "Mobile app", "New product lines"],
  },
];

export default function RoadmapPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-center text-3xl font-bold text-leaf-700 sm:text-4xl">
        Roadmap
      </h1>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {phases.map((phase) => (
          <div
            key={phase.title}
            className="flex flex-col rounded-2xl border border-leaf-100 bg-leaf-50 p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-leaf-700">
              {phase.title}
            </h2>
            <span className="mt-1 text-sm font-medium text-peach-600">
              {phase.period}
            </span>
            <ul className="mt-4 flex-1 list-disc space-y-2 pl-5 text-sm text-leaf-800">
              {phase.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
