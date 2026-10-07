import { Database } from "better-sqlite3"

const db = new Database("./dev.db")

export async function POST(req: Request) {
  const body = await req.json()
  const { submissionId, adminNotes } = body
  const now = new Date().toISOString()

  db.prepare(
    "UPDATE activity_submissions SET status = 'verified', verifiedAt = ? WHERE id = ?"
  ).run(now, submissionId)

  db.prepare(
    "INSERT INTO admin_reviews (id, submissionId, adminId, status, adminNotes, reviewedAt) VALUES (?, ?, ?, 'approved', ?, ?)"
  ).run(crypto.randomUUID(), submissionId, adminNotes || "", now)

  return new Response(JSON.stringify({ success: true }))
}