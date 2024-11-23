import { defineConfig } from "@tanstack/start/config";
import { join } from "node:path";
import type { App } from "vinxi";
import tsConfigPaths from "vite-tsconfig-paths";

const config = {
  appDirectory: "app",
  autoOpenBrowser: false,
};

const app = defineConfig({
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
    ],
  },
  server: {
    compatibilityDate: "2024-11-23",
    experimental: {
      websocket: true,
    },
    preset: "bun",
  },
}).addRouter({
  name: "websocket",
  type: "http",
  handler: "./app/ws.ts",
  target: "server",
  base: "/ws",
});

function withGlobalMiddleware(app: App) {
  return {
    ...app,
    config: {
      ...app.config,
      routers: app.config.routers.map((router) => ({
        ...router,
        middleware:
          router.target !== "server"
            ? undefined
            : join(config.appDirectory, "middleware.ts"),
      })),
    },
  };
}

export default withGlobalMiddleware(app);
