import { GUIDE, PRAYER_TOPICS, SCRIPTURE, SITE, youtubeLinks } from "@/lib/content";
import { SITE_URL } from "@/lib/site-url";

// /llms.txt in the llmstxt.org format: a short, link-rich map of the site for AI assistants.
export const dynamic = "force-static";

export function GET() {
  const u = (path: string) => `${SITE_URL}${path}`;
  const lines = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.mission}`,
    "",
    `${SITE.name} is a free Christian prayer site tied to the ${SITE.name} YouTube channel. Anyone can ask for prayer, pray for others on a public prayer wall, give thanks for answered prayer, and read Bible verses for what they are facing. Every request is read by a real person.`,
    "",
    "## Main pages",
    "",
    `- [Home](${u("/")}): Start here. Submit a prayer, pray for others, give thanks, and watch guided prayers.`,
    `- [Prayer wall](${u("/prayer-wall")}): Public prayer requests from real people. Pray for them and tap "I prayed for this."`,
    `- [Submit a prayer request](${u("/submit")}): Ask for prayer for free, publicly or privately, with an optional email for updates.`,
    `- [Give thanks for answered prayer](${u("/answered")}): Testimonies of answered prayer and a form to share your own.`,
    `- [${GUIDE.title}](${u("/7days")}): A free 7-day prayer guide (PDF). Seven minutes a day, one verse, one teaching, one prayer.`,
    `- [Watch guided prayers](${u("/watch")}): Guided prayers and short devotionals from the YouTube channel.`,
    `- [About](${u("/about")}): Mission, founder, statement of faith, and contact.`,
    "",
    "## Prayers",
    "",
    `- [How to Pray for the First Time](${u("/how-to-pray")}): A simple 5-step beginner's guide to prayer, with a prayer to begin a relationship with Jesus.`,
    ...PRAYER_TOPICS.map((t) => `- [${t.title}](${u(`/prayer/${t.id}`)}): ${t.prayers.length} short written prayers, with answers to common questions.`),
    "",
    "## Scripture by need",
    "",
    `- [Scripture hub](${u("/scripture")}): Bible verses grouped by need, plus how to pray for the first time.`,
    ...SCRIPTURE.needs.map((n) => `- [${n.heading}](${u(`/scripture/${n.id}`)}): ${n.verses.length} verses (${n.translation}) with plain explanations and a prayer.`),
    "",
    "## Optional",
    "",
    `- [YouTube channel](${youtubeLinks().channel}): Guided prayers and daily devotionals.`,
    `- [Privacy policy](${u("/privacy")}): What we collect and how prayer requests are handled.`,
    `- [Terms of use](${u("/terms")}): Rules for posting on the site.`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
