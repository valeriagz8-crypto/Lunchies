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
    <header className="sticky top-0 z-10 border-b border-cream-200 bg-cream-50/90 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5 sm:px-6">
        <Link href="/" className="font-poppins text-[22px] font-extrabold tracking-tight text-leaf-800">
          Lunchies 🍎
        </Link>
        <ul className="hidden items-center gap-0.5 text-[15px] font-semibold text-[#1f3c57] lg:flex">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={
                    isActive
                      ? "block rounded-xl bg-leaf-100 px-3.5 py-2 font-bold text-leaf-700 shadow-[inset_0_-2px_0_0_#2f7d49]"
                      : "block rounded-xl px-3.5 py-2 transition-colors hover:bg-leaf-50 hover:text-leaf-700"
                  }
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="hidden lg:block">
          <Link
            href="/core"
            className="rounded-full bg-leaf-700 px-7 py-3 text-[15px] font-bold text-white shadow-btn transition-colors hover:bg-leaf-800"
          >
            Get started
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-label="Toggle menu"
          className="flex items-center justify-center rounded-md p-2 text-leaf-700 lg:hidden"
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
        <ul className="flex flex-col gap-1 border-t border-cream-200 bg-cream-50 px-4 py-4 text-[15px] font-semibold text-[#1f3c57] lg:hidden">
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
                      ? "block rounded-xl bg-leaf-100 px-3.5 py-2.5 font-bold text-leaf-700"
                      : "block rounded-xl px-3.5 py-2.5 transition-colors hover:bg-leaf-50 hover:text-leaf-700"
                  }
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
          <li className="mt-2">
            <Link
              href="/core"
              onClick={() => setIsOpen(false)}
              className="block rounded-full bg-leaf-700 px-5 py-3 text-center text-[15px] font-bold text-white shadow-btn transition-colors hover:bg-leaf-800"
            >
              Get started
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
}
