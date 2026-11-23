const ALLOWED = new Set([
  "v1/login", "v1/register", "v1/tickets", "v1/game/redeem",
  "v1/game/heartbeat", "v1/game/close", "health"
]);

module.exports = async function handler(req, res) {
  const origin = process.env.ROS_API_ORIGIN;
  if (!origin) return res.status(503).json({ error: "Set ROS_API_ORIGIN in Vercel Environment Variables." });

  const parts = Array.isArray(req.query.path) ? req.query.path : [];
  const route = parts.join("/").replace(/^\\/+|\\/+$/g, "");
  if (!ALLOWED.has(route)) return res.status(404).json({ error: "Route not allowed" });
  if (!["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"].includes(req.method)) {
    res.setHeader("Allow", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    const headers = { Accept: "application/json" };
    if (req.headers["content-type"]) headers["Content-Type"] = req.headers["content-type"];
    if (req.headers.authorization) headers.Authorization = req.headers.authorization;
    if (req.headers["x-ros-captcha"]) headers["X-ROS-Captcha"] = req.headers["x-ros-captcha"];

    const options = { method: req.method, headers };
    if (!["GET", "HEAD"].includes(req.method)) {
      options.body = typeof req.body === "string" ? req.body : JSON.stringify(req.body ?? {});
    }
    const upstream = await fetch(origin.replace(/\\/+$/, "") + "/" + route, options);
    const body = await upstream.text();
    res.status(upstream.status);
    res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/json");
    res.setHeader("Cache-Control", "no-store");
    return res.send(body);
  } catch (e) {
    return res.status(502).json({ error: "Could not reach upstream ROS FRONTLINE API", detail: e.message });
  }
};
