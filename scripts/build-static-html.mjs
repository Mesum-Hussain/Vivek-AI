import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const distDir = path.join(root, "dist");
const outPath = path.join(root, "Vivek_AI.html");

const indexHtml = fs.readFileSync(path.join(distDir, "index.html"), "utf8");

const scriptMatch = indexHtml.match(/src="\.\/assets\/([^"]+\.js)"/);
const cssMatch = indexHtml.match(/href="\.\/assets\/([^"]+\.css)"/);

if (!scriptMatch || !cssMatch) {
  console.error("Could not find dist asset paths in index.html. Run npm run build first.");
  process.exit(1);
}

const js = fs.readFileSync(path.join(distDir, "assets", scriptMatch[1]), "utf8");
const css = fs.readFileSync(path.join(distDir, "assets", cssMatch[1]), "utf8");

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vivek AI</title>
    <meta name="description" content="This AI chat app connects students for collaborative discussions on subject topics, enhancing learning through real-time interaction and support." />
    <meta name="robots" content="noindex, nofollow" />
    <style>html, body { height: 100%; margin: 0; } #root { height: 100%; }</style>
    <style>
${css}
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script>
${js}
    </script>
  </body>
</html>
`;

fs.writeFileSync(outPath, html);
console.log(`Wrote ${outPath} (${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MB)`);
