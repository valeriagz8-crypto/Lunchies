import Link from "next/link";
import { Leaf } from "lucide-react";
import { FOOTER } from "@/lib/homepageData";

export default function Footer() {
  return (
    <footer className="border-t border-leaf-100 bg-leaf-50">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <span className="font-poppins text-lg font-bold text-leaf-700">
              {FOOTER.brand}
            </span>
            <p className="mt-2 text-sm text-leaf-800">{FOOTER.tagline}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-leaf-700 shadow-sm">
              <Leaf className="h-3.5 w-3.5" aria-hidden="true" />
              {FOOTER.badge}
              <span aria-hidden="true">💚</span>
            </span>
          </div>
          {FOOTER.columns.map((column) => (
            <div key={column.title}>
              <h3 className="font-poppins text-sm font-semibold text-leaf-700">
                {column.title}
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-leaf-800">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-peach-500"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-leaf-100 pt-6 text-center text-sm text-leaf-800">
          {FOOTER.copyright}
        </div>
      </div>
    </footer>
  );
}
