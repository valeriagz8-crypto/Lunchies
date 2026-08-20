const valueProps = [
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

export default function Home() {
  return (
    <>
      <section className="bg-[#FBF6EC]">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:py-28">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-800 sm:text-5xl">
              Making lunchtime{" "}
              <span className="text-leaf-600">easier</span> for{" "}
              <span className="text-peach-500">happy kids</span>.
            </h1>
            <p className="mt-6 max-w-md text-lg text-gray-600">
              Lunchies helps you plan balanced, tasty and fun lunches based on
              your child&apos;s preferences, allergies and your busy
              schedule.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#"
                className="rounded-full bg-leaf-600 px-8 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-leaf-700"
              >
                Create my plan
              </a>
              <a
                href="#"
                className="rounded-full border-2 border-leaf-600 px-8 py-3 font-semibold text-leaf-700 transition-colors hover:bg-leaf-50"
              >
                See how it works
              </a>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm text-gray-600">
              <span aria-hidden="true">⭐⭐⭐⭐⭐</span>
              <span>Loved by 150+ parents</span>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <span className="text-[10rem] leading-none" aria-hidden="true">
              🍱
            </span>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
            {valueProps.map((prop) => (
              <div key={prop.title} className="text-center sm:text-left">
                <span className="text-3xl" aria-hidden="true">
                  {prop.icon}
                </span>
                <h2 className="mt-3 text-lg font-semibold text-leaf-700">
                  {prop.title}
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  {prop.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-leaf-100">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-14 text-center sm:px-6 md:flex-row md:justify-between md:text-left">
          <div>
            <h2 className="text-2xl font-bold text-leaf-800 sm:text-3xl">
              Ready to make lunchtime easier?
            </h2>
            <p className="mt-2 text-leaf-700">
              Join Lunchies and start planning better lunches today.
            </p>
          </div>
          <a
            href="#"
            className="shrink-0 rounded-full bg-leaf-600 px-8 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-leaf-700"
          >
            Get started →
          </a>
        </div>
      </section>
    </>
  );
}
