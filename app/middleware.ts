import { defineMiddleware } from "vinxi/http";
import { auth } from "./lib/server/auth";

export default defineMiddleware({
  onRequest: async (event) => {
    try {
      const authSession = await auth.api.getSession({
        headers: event.headers,
      });

      event.context.auth = authSession;
    } catch (error) {
      console.error("Failed to get auth session", error);
    }
  },
});
