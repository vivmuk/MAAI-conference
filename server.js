const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const VENICE_API_KEY = process.env.VENICE_API_KEY;
const DEFAULT_MODEL = process.env.VENICE_MODEL || "openai-gpt-oss-120b";

const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".webp": "image/webp",
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

function sendFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
    res.end(data);
  });
}

async function handleChat(req, res) {
  if (!VENICE_API_KEY) {
    sendJson(res, 500, { error: "AI API key is not configured on the server." });
    return;
  }

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", async () => {
    try {
      const payload = JSON.parse(body || "{}");
      const prompt = payload.prompt || "";
      const useStreaming = payload.stream !== false;
      const systemPrompt = payload.systemPrompt || "You are a helpful Medical Affairs AI assistant. Format all responses using short paragraphs and bullet dots (•). Do not use markdown formatting such as headers (#), bold (**), or bullet points (* or -). Keep responses clear, professional, and actionable.";

      if (!prompt.trim()) {
        sendJson(res, 400, { error: "Prompt is required." });
        return;
      }

      const model = payload.model || DEFAULT_MODEL;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 120000);

      const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ];

      const response = await fetch("https://api.venice.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${VENICE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 8000,
          stream: useStreaming,
          stream_options: useStreaming ? { include_usage: true } : undefined,
          venice_parameters: {
            enable_web_search: "off",
            include_venice_system_prompt: false,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        sendJson(res, response.status, { error: errorText || "AI API error." });
        return;
      }

      if (useStreaming) {
        res.writeHead(200, {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            res.write(chunk);
          }
        } finally {
          reader.releaseLock();
          res.end();
        }
      } else {
        const data = await response.json();
        const content = data.choices && data.choices[0] && data.choices[0].message
          ? data.choices[0].message.content
          : "";
        sendJson(res, 200, { content });
      }
    } catch (error) {
      sendJson(res, 500, { error: "Server error while calling AI." });
    }
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname === "/api/chat" && req.method === "POST") {
    handleChat(req, res);
    return;
  }

  if (url.pathname === "/api/health") {
    sendJson(res, 200, { ok: true });
    return;
  }

  const safePath = path.normalize(url.pathname).replace(/^\\+/, "");
  const filePath = path.join(PUBLIC_DIR, safePath === path.sep ? "index.html" : safePath);

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      sendFile(res, path.join(filePath, "index.html"));
      return;
    }

    if (!err) {
      sendFile(res, filePath);
      return;
    }

    sendFile(res, path.join(PUBLIC_DIR, "index.html"));
  });
});

server.listen(PORT, () => {
  console.log(`Workshop site running on port ${PORT}`);
});
