import Link from "next/link";
import {
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  Music2,
  Mail,
} from "lucide-react";
import { Logo } from "./site-header";
import { navLinks, services, socials } from "@/content/services";
const socialIcons = [Linkedin, null, Facebook, Instagram, Music2, Youtube];
export function SocialLinks() {
  return (
    <div className="socials">
      {socials.map(([name, url], i) => {
        const Icon = socialIcons[i];
        return (
          <a
            href={url}
            key={name}
            aria-label={`Yoletech on ${name}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {Icon ? (
              <Icon size={14} aria-hidden="true" />
            ) : (
              <span aria-hidden="true" className="text-xs font-semibold">
                𝕏
              </span>
            )}
          </a>
        );
      })}
    </div>
  );
}
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo />
            <p>
              Practical technology. Thoughtful solutions.
              <br />
              Helping you build, grow and move forward.
            </p>
            <SocialLinks />
          </div>
          <div>
            <h2>Explore</h2>
            <ul>
              {navLinks.map(([name, href]) => (
                <li key={href}>
                  <Link href={href}>{name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>What we do</h2>
            <ul>
              {services.map((s) => (
                <li key={s.key}>
                  <Link href={`/services#${s.slug}`}>{s.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Client portal</h2>
            <p>
              Access your requests, profile and project updates.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Link href="/login" className="text-link">
                Sign in
              </Link>
              <Link href="/signup" className="text-link">
                Create an account
              </Link>
            </div>
            <a
              className="mt-4 flex items-center gap-2"
              href="mailto:yoletech@yolestica.com"
            >
              <Mail size={13} aria-hidden="true" />
              yoletech@yolestica.com
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Yoletech. All rights reserved.
          </span>
          <div className="flex gap-6">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
