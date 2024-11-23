import type { Session } from "@/lib/client/auth";

declare module "vinxi/http" {
  interface H3EventContext {
    auth: Session | null;
  }
}
