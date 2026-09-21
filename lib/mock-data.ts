export type MockExecMember = {
  id: string;
  name: string;
  title: string;
  photoUrl?: string;
};

export const mockExecBoard: MockExecMember[] = [
  { id: "1", name: "Fernando Gonzalez", title: "President", photoUrl: "/photos/exec/fernando-gonzalez.jpg" },
  { id: "2", name: "Angel Pina", title: "Vice President", photoUrl: "/photos/exec/angel-pina.jpg" },
  { id: "3", name: "Sergio Jimenez", title: "Treasurer", photoUrl: "/photos/exec/sergio-jimenez.jpg" },
  { id: "4", name: "Fernando Nunez", title: "Sergeant-at-Arms", photoUrl: "/photos/exec/fernando-nunez.jpg" },
  { id: "5", name: "Erick Torres", title: "Rush Chair", photoUrl: "/photos/exec/erick-torres.jpg" },
  { id: "6", name: "Rafael Medina", title: "Potential Member Educator", photoUrl: "/photos/exec/rafael-medina.jpg" },
];

export type MockCommittee = {
  id: string;
  name: string;
  chair: string;
};

export const mockCommittees: MockCommittee[] = [
  { id: "1", name: "Recruitment Committee", chair: "Carlos Rojas" },
  { id: "2", name: "Service Committee", chair: "Carlos ROjas" },
  { id: "3", name: "Academics Committee", chair: "Carlos Rojas" },
  { id: "4", name: "Social Committee", chair: "Carlos Rojas" },
];

export const mockConstitutionUrl = "#";

export type MockNewsPost = {
  slug: string;
  type: "spotlight" | "newsletter" | "general";
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
};

export const mockNewsPosts: MockNewsPost[] = [
  {
    slug: "carlos-rojas-amazon-2026",
    type: "spotlight",
    title: "Carlos Rojas — SWE Intern at Amazon",
    excerpt:
      "Carlos is a Chi chapter brother from the Spring 2026 pledge class currently interning at Amazon in Seattle on the Photos team.",
    content:
      "Carlos is a Chi chapter brother from the Spring 2026 pledge class currently interning at Amazon in Seattle on the Photos team. He graduates from UT Austin ECE in May 2027.",
    author: "Chi Chapter Comms",
    publishedAt: "2026-06-01",
  },
  {
    slug: "fall-2026-newsletter",
    type: "newsletter",
    title: "Fall 2026 Chapter Newsletter",
    excerpt:
      "Recap of summer events, rush week schedule, and a look ahead to the fall semester.",
    content:
      "Recap of summer events, rush week schedule, and a look ahead to the fall semester. Full newsletter coming soon.",
    author: "Chi Chapter Comms",
    publishedAt: "2026-05-20",
  },
  {
    slug: "spring-2026-service-recap",
    type: "general",
    title: "Spring 2026 Service Recap",
    excerpt:
      "Chi chapter brothers logged over 500 hours of community service this spring across Austin.",
    content:
      "Chi chapter brothers logged over 500 hours of community service this spring across Austin, partnering with local nonprofits and mentorship programs.",
    author: "Chi Chapter Comms",
    publishedAt: "2026-05-01",
  },
];
