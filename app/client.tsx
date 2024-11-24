import { StartClient } from "@tanstack/start";
import { hydrateRoot } from "react-dom/client";
/// <reference types="vinxi/types/client" />
import { scan } from "react-scan";
import { createRouter } from "./router";
const router = createRouter();
scan({
  enabled: true,
  log: true, // logs render info to console (default: false)
});
hydrateRoot(document, <StartClient router={router} />);
