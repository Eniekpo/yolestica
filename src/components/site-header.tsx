"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { Menu, X, Code2 } from "lucide-react";
import { navLinks } from "@/content/services";
export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="Yoletech home">
      <span className="logo-mark">
        <Code2 size={21} />
      </span>
      YOLETECH<span className="text-brand">.</span>
    </Link>
  );
}
export function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  return (
    <header
      className="site-header"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setOpen(false);
          toggle.current?.focus();
        }
      }}
    >
      <div className="site-container header-inner">
        <Logo />
        <nav className="desktop-nav" aria-label="Main navigation">
          {navLinks.map(([name, href]) => (
            <Link
              className="nav-link"
              key={href}
              href={href}
              aria-current={
                (href === "/" ? path === "/" : path.startsWith(href))
                  ? "page"
                  : undefined
              }
            >
              {name}
            </Link>
          ))}
        </nav>
        <button
          ref={toggle}
          className="mobile-toggle"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-nav md:hidden"
          aria-label="Mobile navigation"
        >
          {navLinks.map(([name, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              aria-current={path === href ? "page" : undefined}
            >
              {name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
