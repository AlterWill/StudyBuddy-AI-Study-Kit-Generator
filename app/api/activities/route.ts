import { Database } from "better-sqlite3"

const db = new Database("./dev.db")

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const studentId = searchParams.get("studentId")

  if (studentId) {
    const submissions = db.prepare(
      `SELECT sa.*, ac.name as category_name, ac.points as category_points 
       FROM activity_submissions sa 
       JOIN activity_categories ac ON sa.categoryId = ac.id 
       WHERE sa.studentId = ? 
       ORDER BY sa.submittedAt DESC`
    ).all(studentId) as any[]

    return new Response(JSON.stringify({ submissions }))
  }

  const allSubmissions = db.prepare(
    `SELECT sa.*, u.name as student_name, ac.name as category_name, ac.points as category_points 
     FROM activity_submissions sa 
     JOIN users u ON sa.studentId = u.id 
     JOIN activity_categories ac ON sa.categoryId = ac.id 
     ORDER BY sa.submittedAt DESC`
  ).all() as any[]

  return new Response(JSON.stringify({ allSubmissions }))
}

export async function POST(req: Request) {
  const body = await req.json()
  const { categoryId, title, description, proofUrl, studentId } = body

  const result = db.prepare(
    `INSERT INTO activity_submissions (id, studentId, categoryId, title, description, proofUrl, status, pointsAwarded) 
     VALUES (?, ?, ?, ?, ?, ?, 'pending', NULL)`
  ).run(crypto.randomUUID(), studentId, categoryId, title, description, proofUrl || null)

  // Award points based on category
  const category = db.prepare("SELECT points FROM activity_categories WHERE id = ?").get(categoryId)
  const pointsAwarded = category ? category.points : 0

  db.prepare(
    "UPDATE activity_submissions SET pointsAwarded = ? WHERE id = ?"
  ).run(pointsAwarded, result.lastInsertRowid)

  return new Response(JSON.stringify({ 
    success: true, 
    submissionId: result.lastInsertRowid,
    pointsAwarded 
  }))
}