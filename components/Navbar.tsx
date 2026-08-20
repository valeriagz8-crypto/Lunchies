import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/plans", label: "Plans" },
  { href: "/about", label: "About us" },
  { href: "/docs", label: "Docs" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-leaf-100 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-bold text-leaf-700">
          Lunchies 🍎
        </Link>
        <ul className="hidden items-center gap-6 text-sm font-medium text-leaf-800 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="transition-colors hover:text-peach-500"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <a
          href="#"
          className="rounded-full bg-leaf-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-leaf-700"
        >
          Get started
        </a>
      </nav>
    </header>
  );
}
