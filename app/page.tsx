import Link from "next/link";

export default function Home() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-6">
      <span className="text-6xl">🍱</span>
      <h1 className="text-4xl font-extrabold tracking-tight text-leaf-700 sm:text-6xl">
        Lunchies
      </h1>
      <p className="max-w-xl text-lg text-leaf-800 sm:text-xl">
        Loncheras saludables y personalizadas para niños, entregadas directo
        en su escuela.
      </p>
      <Link
        href="/roadmap"
        className="mt-4 rounded-full bg-peach-500 px-8 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-peach-600"
      >
        Conoce más
      </Link>
    </section>
  );
}
