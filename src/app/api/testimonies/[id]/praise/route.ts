import { fail, ok } from "@/lib/api";
import { getStore } from "@/lib/store";
import { deviceKey } from "@/lib/security";
import { isUuid } from "@/lib/validate";

export async function POST(req: Request, ctx: RouteContext<"/api/testimonies/[id]/praise">) {
  const { id } = await ctx.params;
  if (!isUuid(id)) return fail("Not found.", 404);
  const result = await getStore().react("praise", id, deviceKey(req.headers));
  if (result.ok) return ok({ count: result.count });
  if (result.reason === "already") return ok({ already: true });
  return fail("This testimony is no longer available.", 404);
}
