const columns = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/how-it-works" },
      { label: "Plans", href: "/plans" },
      { label: "Docs", href: "/docs" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Our mission", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-leaf-100 bg-leaf-50">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <span className="text-lg font-bold text-leaf-700">Lunchies</span>
            <p className="mt-2 text-sm text-leaf-800">
              Healthy kids, happy parents.
            </p>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-leaf-700">
                {column.title}
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-leaf-800">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="transition-colors hover:text-peach-500"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-leaf-100 pt-6 text-center text-sm text-leaf-800">
          © 2026 Lunchies · Hecho por Valeria Gómez Zamudio
        </div>
      </div>
    </footer>
  );
}
