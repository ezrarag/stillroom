import { cp, mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const serverDir = resolve(root, "dist/server");
const openaiDir = resolve(root, "dist/.openai");

await mkdir(serverDir, { recursive: true });
await mkdir(openaiDir, { recursive: true });
await cp(resolve(root, ".openai/hosting.json"), resolve(openaiDir, "hosting.json"));

const worker = `
export default {
  async fetch(request, env) {
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Stillroom site artifact is ready. Static asset binding is unavailable in this local worker context.", {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  },
};
`;

await writeFile(resolve(serverDir, "index.js"), worker.trimStart());
