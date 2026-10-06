"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/core", label: "Core" },
  { href: "/research", label: "Research" },
  { href: "/product", label: "Product" },
  { href: "/pricing", label: "Pricing" },
  { href: "/marketing", label: "Marketing" },
  { href: "/chat", label: "Chat" },
  { href: "/docs", label: "Docs" },
  { href: "/demo", label: "Demo" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 border-b border-leaf-100 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-bold text-leaf-700">
          Lunchies 🍎
        </Link>
        <ul className="hidden items-center gap-6 text-sm font-medium text-leaf-800 md:flex">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={
                    isActive
                      ? "text-peach-500"
                      : "transition-colors hover:text-peach-500"
                  }
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="hidden md:block">
          <a
            href="#"
            className="rounded-full bg-leaf-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-leaf-700"
          >
            Get started
          </a>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-label="Toggle menu"
          className="flex items-center justify-center rounded-md p-2 text-leaf-700 md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            {isOpen ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>
      </nav>
      {isOpen && (
        <ul className="flex flex-col gap-1 border-t border-leaf-100 px-4 py-4 text-sm font-medium text-leaf-800 md:hidden">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setIsOpen(false)}
                  className={
                    isActive
                      ? "block rounded-md px-3 py-2 text-peach-500"
                      : "block rounded-md px-3 py-2 transition-colors hover:text-peach-500"
                  }
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
          <li className="mt-2">
            <a
              href="#"
              className="block rounded-full bg-leaf-600 px-5 py-2 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-leaf-700"
            >
              Get started
            </a>
          </li>
        </ul>
      )}
    </header>
  );
}
