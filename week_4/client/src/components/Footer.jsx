import { ShieldIcon, GlobeIcon, MailIcon, InstagramIcon, TwitterIcon, FacebookIcon } from './Icons';

const linkGroups = [
  { title: 'Company', links: ['About Us', 'Careers', 'Contact'] },
  { title: 'Legal', links: ['Terms of Service', 'Privacy Policy', 'Refund Policy'] },
  { title: 'Support', links: ['Help Center', 'Travel Safety', 'Status'] },
];

const socials = [
  { label: 'Instagram', Icon: InstagramIcon },
  { label: 'Twitter', Icon: TwitterIcon },
  { label: 'Facebook', Icon: FacebookIcon },
];

function Footer() {
  return (
    <footer className="bg-surface py-9 text-[0.78rem] text-ink-soft">
      <div className="mx-auto w-full px-4 sm:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1.2fr_1.6fr_1fr]">
          <div className="grid max-w-sm gap-2 leading-relaxed md:col-span-2 md:max-w-none lg:col-span-1 lg:max-w-sm">
            <p className="text-[0.82rem] text-ink"><strong>&copy; 2026 Wanderlust Destinations.</strong></p>
            <p>Crafting unforgettable journeys for global explorers. All rights reserved. Registered travel agency license #123456789.</p>
          </div>

          {/* Link columns, generated from the linkGroups array */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:justify-start">
            {linkGroups.map((group) => (
              <nav key={group.title} aria-labelledby={`footer-${group.title}`}>
                <h2 id={`footer-${group.title}`} className="mb-4 text-[0.78rem] font-bold text-ink">{group.title}</h2>
                <ul className="grid gap-3">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a href="#home" className="transition-colors hover:text-accent-dark">{link}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="grid justify-items-start gap-3">
            <ul className="mb-1 flex gap-2.5" aria-label="Social media">
              {socials.map(({ label, Icon }) => (
                <li key={label}>
                  <a href="#home" aria-label={label} className="grid h-9 w-9 place-items-center rounded-lg border border-line text-ink-soft transition hover:border-accent hover:text-accent-dark">
                    <Icon size={18} />
                  </a>
                </li>
              ))}
            </ul>
            <p className="flex items-center gap-2 font-medium"><ShieldIcon size={16} />Secure Booking Guaranteed</p>
            <p className="flex items-center gap-2 font-medium"><GlobeIcon size={16} />Global Coverage</p>
          </div>
        </div>

        <div className="mt-11 flex flex-col gap-3 border-t border-line pt-6 text-[0.68rem] text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <address className="not-italic">123 Adventure Lane, Explorer City, Earth 90210</address>
          <a href="mailto:support@wanderlust.travel" className="inline-flex items-center gap-2 transition-colors hover:text-accent-dark">
            <MailIcon size={14} />
            support@wanderlust.travel
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
