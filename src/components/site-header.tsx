"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Code2 } from "lucide-react";
import { navLinks } from "@/content/services";

export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="Yoletech home">
      <span className="logo-mark">
        <Code2 size={21} aria-hidden="true" />
      </span>
      YOLETECH<span className="text-brand">.</span>
    </Link>
  );
}

export function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);

  // Focus trap for mobile navigation when open
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }

      if (e.key === "Tab") {
        const toggleBtn = toggleRef.current;
        const navEl = mobileNavRef.current;
        if (!toggleBtn || !navEl) return;

        const focusableInNav = Array.from(
          navEl.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        );
        const focusable = [toggleBtn, ...focusableInNav];
        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <header ref={headerRef} className="site-header">
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
        <div className="header-actions">
          <Link href="/login" className="text-link">
            Sign in
          </Link>
          <Link href="/signup" className="btn btn-primary btn-sm">
            Get Started
          </Link>
        </div>
        <button
          ref={toggleRef}
          className="mobile-toggle"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      {open && (
        <nav
          ref={mobileNavRef}
          id="mobile-navigation"
          className="mobile-nav md:hidden"
          aria-label="Mobile navigation"
        >
          {navLinks.map(([name, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => {
                setOpen(false);
                toggleRef.current?.focus();
              }}
              aria-current={path === href ? "page" : undefined}
            >
              {name}
            </Link>
          ))}
          <div className="mobile-auth">
            <Link
              href="/login"
              onClick={() => {
                setOpen(false);
                toggleRef.current?.focus();
              }}
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              onClick={() => {
                setOpen(false);
                toggleRef.current?.focus();
              }}
            >
              Get Started
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
