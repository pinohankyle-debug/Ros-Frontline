# ROS FRONTLINE — Vercel website template

## Included
- Static community landing page in `public/index.html`
- Registration/login UI
- Ticket and game-session request UI
- Vercel serverless proxy in `api/[...path].js`
- Proxy allowlist for the current ROS FRONTLINE API route names

## Deploy
1. Extract this ZIP.
2. Import the extracted project into a GitHub repository.
3. In Vercel, select **Add New → Project** and import that repository.
4. In Project Settings → Environment Variables, add:
   - `ROS_API_ORIGIN` = the HTTPS base URL of your existing ROS FRONTLINE API, without a trailing slash.
5. Redeploy, then open your Vercel deployment URL.

No frontend build command is required.

## Important
This template hosts the website and a serverless HTTPS proxy. It does NOT host the persistent Flask API process or GNS UDP multiplayer server. Keep those on a VPS that supports persistent processes and UDP.

The form payloads and response field names (`token`, `ticket`, `game_token`) are sensible defaults based on the route names, but must match the actual Flask API contract. If your API uses different JSON fields, edit the handlers in `public/index.html`.

Do not put passwords, signing keys, or private API credentials in frontend code. Set `ROS_API_ORIGIN` only in Vercel Environment Variables.

## API proxy routes
The proxy forwards only:
- `health`
- `v1/login`
- `v1/register`
- `v1/tickets`
- `v1/game/redeem`
- `v1/game/heartbeat`
- `v1/game/close`

Browser → Vercel HTTPS → existing ROS FRONTLINE API. GNS UDP remains on your game server.
