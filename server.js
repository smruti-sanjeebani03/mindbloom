import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { createProxyMiddleware } from "http-proxy-middleware";
import { spawn } from "child_process";
import http from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DJANGO_PORT = 8001;
const DJANGO_HOST = "127.0.0.1";

const DJANGO_URL = `http://${DJANGO_HOST}:${DJANGO_PORT}`;

// ---------------------------------------------------------
// Find the correct Python executable
// ---------------------------------------------------------

function getPythonCommand() {
  const projectRoot = process.cwd();

  const candidates =
    process.platform === "win32"
      ? [
          path.join(projectRoot, ".venv", "Scripts", "python.exe"),
          path.join(projectRoot, "venv", "Scripts", "python.exe"),
        ]
      : [
          path.join(projectRoot, ".venv", "bin", "python"),
          path.join(projectRoot, "venv", "bin", "python"),
        ];

  for (const pythonPath of candidates) {
    if (fs.existsSync(pythonPath)) {
      return pythonPath;
    }
  }

  // Fallback
  return process.platform === "win32" ? "python" : "python3";
}

// ---------------------------------------------------------
// Check whether Django is already running
// ---------------------------------------------------------

function checkDjangoRunning(host, port) {
  return new Promise((resolve) => {
    const req = http.get(
      `http://${host}:${port}/api/auth/profile/`,
      (res) => {
        // Any HTTP response means Django is alive.
        // 401 is expected because this request has no JWT.
        res.resume();
        resolve(true);
      }
    );

    req.on("error", () => {
      resolve(false);
    });

    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// ---------------------------------------------------------
// Start Django automatically if it isn't running
// ---------------------------------------------------------

async function ensureDjangoRunning() {
  const alreadyRunning = await checkDjangoRunning(
    DJANGO_HOST,
    DJANGO_PORT
  );

  if (alreadyRunning) {
    console.log(
      `[Express] Django server is already running on ${DJANGO_URL}.`
    );
    return;
  }

  const pythonCommand = getPythonCommand();

  console.log(
    `[Express] Starting Django REST Framework on ${DJANGO_URL}...`
  );

  console.log(`[Express] Using Python: ${pythonCommand}`);

  const djangoProcess = spawn(
    pythonCommand,
    [
      "manage.py",
      "runserver",
      `${DJANGO_HOST}:${DJANGO_PORT}`,
    ],
    {
      cwd: process.cwd(),
      stdio: "inherit",
      env: {
        ...process.env,
        PYTHONUNBUFFERED: "1",
      },
    }
  );

  djangoProcess.on("error", (error) => {
    console.error(
      "[Express] Failed to start Django:",
      error.message
    );
  });

  djangoProcess.on("exit", (code, signal) => {
    if (code !== null) {
      console.log(
        `[Express] Django process exited with code ${code}.`
      );
    } else {
      console.log(
        `[Express] Django process exited with signal ${signal}.`
      );
    }
  });

  // Give Django some time to start.
  for (let attempt = 1; attempt <= 30; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const running = await checkDjangoRunning(
      DJANGO_HOST,
      DJANGO_PORT
    );

    if (running) {
      console.log(
        `[Express] Django server successfully verified on port ${DJANGO_PORT}!`
      );
      return;
    }
  }

  throw new Error(
    `Django failed to start on ${DJANGO_URL}.`
  );
}

// ---------------------------------------------------------
// Express application
// ---------------------------------------------------------

const app = express();

// ---------------------------------------------------------
// Django API Reverse Proxy
//
// IMPORTANT:
// We are NOT mounting this with app.use("/api", ...).
// That can alter the path before the proxy sees it.
//
// Instead, the proxy itself filters /api requests,
// preserving the complete path:
//
// /api/auth/google/
// /api/auth/profile/
// /api/journal/
// /api/moods/
// etc.
//
// They arrive at Django exactly as /api/...
// ---------------------------------------------------------

const djangoProxy = createProxyMiddleware({
  target: DJANGO_URL,

  changeOrigin: true,

  ws: true,

  pathFilter: (pathname) => {
    return pathname === "/api" || pathname.startsWith("/api/");
  },

  on: {
    proxyReq: (proxyReq, req) => {
      // Forward Authorization header explicitly.
      const authHeader = req.headers.authorization;

      if (authHeader) {
        proxyReq.setHeader("Authorization", authHeader);
      }

      // Forward content type when present.
      const contentType = req.headers["content-type"];

      if (contentType) {
        proxyReq.setHeader("Content-Type", contentType);
      }
    },

    proxyRes: (proxyRes, req) => {
      console.log(
        `[Proxy] ${req.method} ${req.originalUrl} → Django ${proxyRes.statusCode}`
      );
    },

    error: (error, req, res) => {
      console.error(
        `[Express] Django proxy error for ${req.method} ${req.originalUrl}:`,
        error.message
      );

      if (!res.headersSent) {
        res.status(502).json({
          success: false,
          message:
            "Unable to communicate with MindBloom backend server.",
        });
      }
    },
  },
});

// IMPORTANT: Mount proxy WITHOUT "/api"
app.use(djangoProxy);

// ---------------------------------------------------------
// Vite development server / production static files
// ---------------------------------------------------------

async function startServer() {
  // Start Django before Vite/Express begins accepting requests.
  await ensureDjangoRunning();

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },

      appType: "spa",
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");

    app.use(express.static(distPath));

    app.get("*", (req, res) => {
      res.sendFile(
        path.join(distPath, "index.html")
      );
    });
  }

  // -------------------------------------------------------
  // Start Express
  // -------------------------------------------------------

  app.listen(PORT, "0.0.0.0", () => {
    console.log("");
    console.log("==============================================");
    console.log("        MindBloom Server Started 🌱");
    console.log("==============================================");
    console.log(
      `Frontend:  http://localhost:${PORT}`
    );
    console.log(
      `Django:    ${DJANGO_URL}`
    );
    console.log(
      `API Proxy: /api/* → ${DJANGO_URL}/api/*`
    );
    console.log("==============================================");
    console.log("");
  });
}

// ---------------------------------------------------------
// Global startup error handling
// ---------------------------------------------------------

startServer().catch((error) => {
  console.error("");
  console.error("==============================================");
  console.error("      MindBloom failed to start ❌");
  console.error("==============================================");
  console.error(error.message);
  console.error("==============================================");
  process.exit(1);
});