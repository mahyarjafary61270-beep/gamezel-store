export type GameCover = {
  src: string;
  pos: string;
};

const COVERS: Record<string, GameCover> = {
  "dota-2": { src: "/images/games/dota-2.jpg", pos: "50% 50%" },
  "gta-v": { src: "/images/games/gta-v.jpg", pos: "50% 50%" },
  "fc-27": { src: "/images/games/fc-27.jpg", pos: "50% 36%" },
  valorant: { src: "/images/games/valorant.jpg", pos: "50% 42%" },
};

export function getGameCover(slug: string): GameCover | null {
  return COVERS[slug] ?? null;
}

export const CARD_GRADS = [
  "linear-gradient(135deg,#064e3b,#052e16 60%,#0a0a0a)",
  "linear-gradient(135deg,#14532d,#166534 60%,#0a0a0a)",
  "linear-gradient(135deg,#134e4a,#0f766e 60%,#0a0a0a)",
  "linear-gradient(135deg,#052e16,#15803d 60%,#0a0a0a)",
  "linear-gradient(135deg,#1a2e05,#3f6212 60%,#0a0a0a)",
  "linear-gradient(135deg,#042f2e,#115e59 60%,#0a0a0a)",
];
