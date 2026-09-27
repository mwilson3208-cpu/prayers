import "server-only";
import { env, isDemoMode } from "../env";
import { createMemoryStore } from "./memory";
import { createSupabaseStore } from "./supabase";
import type { Store } from "./types";

let store: Store | null = null;

export function getStore(): Store {
  if (!store) {
    store = isDemoMode ? createMemoryStore() : createSupabaseStore(env.supabaseUrl, env.supabaseServiceKey);
  }
  return store;
}

export type { Store } from "./types";
