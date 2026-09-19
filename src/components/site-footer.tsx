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
import { navLinks, services, socials, whatsapp } from "@/content/services";
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
              <Icon size={14} />
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
            <h3>Explore</h3>
            <ul>
              {navLinks.map(([name, href]) => (
                <li key={href}>
                  <Link href={href}>{name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>What we do</h3>
            <ul>
              {services.map((s) => (
                <li key={s.key}>
                  <Link href={`/services#${s.slug}`}>{s.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Client portal</h3>
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
              <Mail size={13} />
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
