#!/usr/bin/env node

void (async () => {
  const mod = await import("../build/scripts/start2/index.js");
  await mod.default();
})();
