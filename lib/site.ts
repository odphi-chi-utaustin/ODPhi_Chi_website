// Public-site settings. Blank strings hide the thing they feed, so fill these in as they exist.

// Shown on /contact and in the footer.
export const chapterEmail = "";
export const mailingAddress: string[] = [];

// Where form submissions (contact, alumni updates, referrals) get emailed, on top of the
// portal inbox. Needs RESEND_API_KEY; blank sends nothing.
export const inquiryNotifyEmail = "";

// /events. From Google Calendar: Settings → your calendar → "Integrate calendar".
// calendarEmbedUrl is the src="…" inside the embed code; calendarPublicUrl is the
// "Public URL to this calendar" link. The calendar must be public for the embed to show.
export const calendarEmbedUrl = "";
export const calendarPublicUrl = "";

// /give. Suggested amounts in dollars; donors can also type their own.
export const donationPresets = [25, 50, 100, 250];
export const donationFunds = [
  { value: "general", label: "Where it's needed most" },
  { value: "recruitment", label: "Recruitment" },
  { value: "service", label: "Service & Young Knights" },
  { value: "scholarship", label: "Brother scholarships" },
];

export type NavLink = { href: string; label: string };
export type NavItem = NavLink & { children?: NavLink[] };

export const navItems: NavItem[] = [
  {
    href: "/about",
    label: "About",
    children: [
      { href: "/about", label: "The Chi Chapter" },
      { href: "/about/history", label: "History" },
      { href: "/about#committees", label: "Committees" },
    ],
  },
  { href: "/membership", label: "Rush" },
  {
    href: "/news",
    label: "News & Events",
    children: [
      { href: "/news", label: "News" },
      { href: "/events", label: "Calendar" },
    ],
  },
  {
    href: "/alumni",
    label: "Alumni",
    children: [
      { href: "/alumni", label: "Alumni Home" },
      { href: "/alumni/update", label: "Update Your Information" },
      { href: "/alumni/recommend", label: "Recruitment Recommendations" },
    ],
  },
  { href: "/give", label: "Give" },
  { href: "/contact", label: "Contact" },
];
