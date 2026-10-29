import type { Step } from "@/lib/homepageData";

/** The little illustration on each "How it works" card. */
export default function StepArt({ art }: { art: Step["art"] }) {
  if (art === "phone") {
    return (
      <span className="flex h-16 w-11 items-center justify-center rounded-xl border-4 border-gray-800 bg-white">
        <span className="h-10 w-6 rounded bg-leaf-50" />
      </span>
    );
  }

  if (art === "bowl") {
    return (
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-inner">
        <span aria-hidden="true" className="text-3xl">
          🥗
        </span>
      </span>
    );
  }

  return (
    <span className="flex h-16 w-16 flex-col items-center justify-end">
      <span
        aria-hidden="true"
        className="h-0 w-0 border-x-[1.75rem] border-b-[1rem] border-x-transparent border-b-peach-500"
      />
      <span className="flex h-9 w-12 items-end justify-center rounded-b-md bg-amber-100 pb-1">
        <span className="h-5 w-3 rounded-t-full bg-peach-400" />
      </span>
    </span>
  );
}
