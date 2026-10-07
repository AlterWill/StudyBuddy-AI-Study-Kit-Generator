import { Database } from "better-sqlite3"

const db = new Database("./dev.db")

export async function GET() {
  const submissions = db.prepare(`
    SELECT sa.*, u.name as studentName, ac.name as categoryName, ac.points as categoryPoints
    FROM activity_submissions sa
    JOIN users u ON sa.studentId = u.id
    JOIN activity_categories ac ON sa.categoryId = ac.id
    WHERE sa.status = 'pending'
    ORDER BY sa.submittedAt DESC
  `).all() as any[]

  return new Response(JSON.stringify({ submissions }))
}