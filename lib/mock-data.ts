export type MockExecMember = {
  id: string;
  name: string;
  title: string;
  photoUrl?: string;
};

export const mockExecBoard: MockExecMember[] = [
  { id: "1", name: "Fernando Gonzalez", title: "President", photoUrl: "/photos/exec/fernando-gonzalez.jpg" },
  { id: "5", name: "Erick Torres", title: "Vice President & Rush Chair", photoUrl: "/photos/exec/erick-torres.jpg" },
  { id: "3", name: "Sergio Jimenez", title: "Treasurer", photoUrl: "/photos/exec/sergio-jimenez.jpg" },
  { id: "4", name: "Fernando Nunez", title: "Sergeant-at-Arms", photoUrl: "/photos/exec/fernando-nunez.jpg" },
  { id: "6", name: "Rafael Medina", title: "Academic Affairs & Prospective New Member Educator", photoUrl: "/photos/exec/rafael-medina.jpg" },
];

export type MockCommittee = {
  id: string;
  name: string;
  chair: string;
  description: string;
};

export const mockCommittees: MockCommittee[] = [
  {
    id: "1",
    name: "Recruitment Committee",
    chair: "Erick Torres",
    description:
      "Plans fall and spring rush, meets potential new members, and follows up on recommendations from alumni and families.",
  },
  {
    id: "2",
    name: "Service Committee",
    chair: "Erick Torres",
    description:
      "Runs Young Knights mentorship, organizes philanthropy events, and tracks the chapter's community service hours.",
  },
  {
    id: "3",
    name: "Academics Committee",
    chair: "Rafael Medina",
    description:
      "Sets the chapter's GPA goals, runs study hours and peer tutoring, and checks in with brothers who need support.",
  },
  {
    id: "4",
    name: "Social Committee",
    chair: "Fernando Nunez",
    description:
      "Plans brotherhood events, mixers, and Founders Week, and brings actives and alumni together throughout the year.",
  },
];

export const mockConstitutionUrl = "#";
