/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

/** Full git commit SHA injected at build time (`git rev-parse HEAD`). */
declare const __APP_COMMIT_SHA__: string;

/** GitHub commit URL for `__APP_COMMIT_SHA__`, or empty when unavailable. */
declare const __APP_COMMIT_URL__: string;
