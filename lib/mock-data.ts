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
  { id: "1", name: "Recruitment Committee", chair: "Erick Torres" },
  { id: "2", name: "Service Committee", chair: "Rafael Medina" },
  { id: "3", name: "Academics Committee", chair: "Rafael Medina" },
  { id: "4", name: "Social Committee", chair: "Fernando Nunez" },
];

export const mockConstitutionUrl = "#";
