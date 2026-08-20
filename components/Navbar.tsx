import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/docs", label: "Docs" },
  { href: "/roadmap", label: "Roadmap" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-leaf-100 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-bold text-leaf-700">
          Lunchies 🍎
        </Link>
        <ul className="flex items-center gap-4 text-sm font-medium text-leaf-800 sm:gap-6">
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
          <li>
            <a
              href="#"
              className="transition-colors hover:text-peach-500"
            >
              GitHub
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
