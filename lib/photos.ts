// Chapter photography. Web-sized copies live in public/photos; originals in photos-src (gitignored).
// Set a value to null to fall back to a labelled placeholder.
export const photos = {
  hero: "/photos/hero.jpg" as string | null, // full chapter on stage, landscape
  about: "/photos/exec-board.jpg" as string | null, // exec board in suits, portrait
  rush: null as string | null,
};
