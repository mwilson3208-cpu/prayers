// Shared by the browser (live notice on the Submit form) and the server
// (flags the request for the admin). Keep it free of server-only imports.

const CRISIS_PATTERNS: RegExp[] = [
  /\bsuicid(e|al)\b/,
  /\bkill(ing)? (my ?self|me)\b/,
  /\b(end|take|ending|taking) (my|my own) life\b/,
  /\bend it all\b/,
  /\b(want|wanna|wanting|going|ready) to die\b/,
  /\bdon'?t want to (live|be alive|be here|wake up)\b/,
  /\bno (reason|point) (to|in) (live|living|going on)\b/,
  /\bbetter off dead\b/,
  /\bbetter off without me\b/,
  /\bself[- ]?harm/,
  /\b(hurt|hurting|cut|cutting) (my ?self)\b/,
  /\boverdos(e|ing)\b/,
  /\b(he|she|they) (is going to|will|wants to|threatened to) kill me\b/,
  /\bafraid for my (life|safety)\b/,
  /\b(beats|beating|hits|hitting|chokes|choking) me\b/,
  /\bin danger\b/,
  /\bnot safe at home\b/,
];

export function mentionsCrisis(text: string): boolean {
  const t = text.toLowerCase().replace(/[’‘]/g, "'");
  return CRISIS_PATTERNS.some((re) => re.test(t));
}
