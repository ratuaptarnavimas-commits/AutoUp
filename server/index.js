import http from "node:http";
import { env } from "./config/env.js";
import { healthRoute } from "./routes/health.js";
import { productsRoute } from "./routes/products.js";
import { vehiclesRoute } from "./routes/vehicles.js";
import { ordersRoute } from "./routes/orders.js";
import { sendError } from "./utils/errors.js";

const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": env.corsOrigin, "Access-Control-Allow-Methods": "GET,POST,OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };
const readBody = (request) => new Promise((resolve, reject) => { let body = ""; request.on("data", (chunk) => { body += chunk; if (body.length > 1_000_000) reject(new Error("Request body too large")); }); request.on("end", () => { try { resolve(body ? JSON.parse(body) : {}); } catch { reject(new Error("Invalid JSON body")); } }); request.on("error", reject); });
const send = (response, statusCode, payload) => { response.writeHead(statusCode, headers); response.end(JSON.stringify(payload)); };

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
  if (request.method === "OPTIONS") { response.writeHead(204, headers); response.end(); return; }
  try {
    let payload;
    if (request.method === "GET" && url.pathname === "/api/health") payload = healthRoute();
    else if (request.method === "GET" && url.pathname.startsWith("/api/products")) payload = await productsRoute(url);
    else if (request.method === "GET" && url.pathname.startsWith("/api/vehicles/")) payload = await vehiclesRoute(url);
    else if (request.method === "POST" && url.pathname === "/api/orders") payload = await ordersRoute(await readBody(request));
    else { send(response, 404, { error: "Not found" }); return; }
    if (payload === null) { send(response, 404, { error: "Not found" }); return; }
    send(response, 200, payload);
  } catch (error) { sendError(response, error); }
});

server.listen(env.port, () => console.log(`AutoUp API listening on http://localhost:${env.port}`));
