import { Database } from "better-sqlite3";

const db = new Database("./dev.db");

export async function GET() {
  const cookie = globalThis?.process?.env?.NODE_ENV === "production"
    ? undefined
    : req?.cookies?.get?.('session') // This won't work at runtime, will be handled client-side

  // This endpoint will be called from the client with the session cookie
  return new Response(JSON.stringify({}))
}