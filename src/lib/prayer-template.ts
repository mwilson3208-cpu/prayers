import type { Category } from "./constants";

const LINES: Record<Category | "default", string> = {
  Health:
    "You are the Great Physician. Touch this body with Your healing power. Give wisdom to every doctor and nurse, and strength for every hard day. Where fear has crept in, fill this heart with Your peace.",
  Family:
    "You set the lonely in families. Bring healing where there is hurt, softness where there is hardness, and forgiveness where there has been pain. Make this home a place where Your love lives.",
  Finances:
    "You own the cattle on a thousand hills and You know every need. Open the right doors, provide daily bread, and give wisdom for every decision. Replace worry with trust in Your faithful care.",
  "Anxiety and Peace":
    "You are the Prince of Peace. Quiet the racing thoughts and calm this anxious heart. Guard this mind with Your peace that is beyond understanding, and give sweet rest tonight.",
  Grief:
    "You are near to the brokenhearted. Hold this grieving heart close. Comfort in the quiet moments, carry through the hardest days, and fill the emptiness with Your presence and hope.",
  Direction:
    "You are the Good Shepherd who leads Your sheep. Light the next step on this path. Give clear wisdom, close the wrong doors, open the right ones, and give courage to follow You.",
  Salvation:
    "You are not willing that any should perish. Draw this person to Yourself with cords of love. Open their eyes to see Jesus, soften their heart, and bring them home to You.",
  Other:
    "You know every detail of this need, even the parts that were not written down. Meet this person right where they are, and let them feel how deeply You love them.",
  default:
    "You know every detail of this need, even the parts that were not written down. Meet this person right where they are, and let them feel how deeply You love them.",
};

export function templatePrayer(name: string, category: Category | null): string {
  const who = !name || name === "Anonymous" ? "my brother or sister" : name;
  return [
    `Father, I lift up ${who} to You right now.`,
    LINES[category ?? "default"],
    "Thank You that You hear every prayer and that nothing is too hard for You.",
    "In Jesus' name, amen.",
  ].join(" ");
}
