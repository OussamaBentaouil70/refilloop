import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fallbackStorageSvg(label: string) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800" role="img" aria-label="${label}">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#dce6d7" />
          <stop offset="100%" stop-color="#f8f4ea" />
        </linearGradient>
      </defs>
      <rect width="800" height="800" fill="#fffdf8"/>
      <rect x="60" y="60" width="680" height="680" rx="42" fill="url(#g)" stroke="#173a2b" stroke-opacity="0.15"/>
      <circle cx="400" cy="300" r="160" fill="#2f6b4f" fill-opacity="0.12"/>
      <path d="M317 404C345 336 460 317 515 364C550 394 570 439 566 490H234C237 456 265 425 317 404Z" fill="#2f6b4f" fill-opacity="0.82"/>
      <circle cx="400" cy="272" r="70" fill="#bd684e" fill-opacity="0.9"/>
      <text x="400" y="590" text-anchor="middle" font-size="44" font-family="Arial, sans-serif" fill="#173a2b" font-weight="700">RefillLoop</text>
    </svg>
  `;
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.get("/manus-storage/*", (req: express.Request, res: express.Response) => {
    const params = req.params as { "0"?: string } & Record<string, string | undefined>;
    const key = params[0] || "refillloop-media";
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "no-store");
    res.send(fallbackStorageSvg(key));
  });

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
