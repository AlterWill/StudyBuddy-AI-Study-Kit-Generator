import Database from "better-sqlite3";
import { hashPassword, verifyPassword } from "@/app/lib/auth";

const db = new Database("./dev.db");

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action')

  if (action === 'verify') {
    const user = db.prepare("SELECT id, email, name, role FROM users WHERE email = ?")
      .get(searchParams.get('email'))

    if (user) {
      return new Response(JSON.stringify({ exists: true, role: user.role }))
    }
    return new Response(JSON.stringify({ exists: false }))
  }

  if (action === 'session') {
    const cookie = req.cookies.get('session')
    if (cookie) {
      const session = db.prepare("SELECT userId, expiresAt FROM sessions WHERE id = ?")
        .get(cookie.value)

      if (session && new Date(session.expiresAt) > new Date()) {
        const user = db.prepare("SELECT id, email, name, role FROM users WHERE id = ?")
          .get(session.userId)

        if (user) {
          return new Response(JSON.stringify({ 
            loggedIn: true, 
            user: { id: user.id, email: user.email, name: user.name, role: user.role } 
          }))
        }
      }
    }
    return new Response(JSON.stringify({ loggedIn: false }))
  }

  return new Response(JSON.stringify({}))
}

export async function POST(req: Request) {
  const body = await req.json()
  const { action, ...rest } = body

  if (action === 'signup') {
    const { email, password, name } = rest

    const existingUser = db.prepare("SELECT id FROM users WHERE email = ?")
      .get(email)

    if (existingUser) {
      return new Response(JSON.stringify({ error: "Email already registered" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const hashedPassword = await hashPassword(password)

    const result = db.prepare(
      "INSERT INTO users (id, email, name, password, role) VALUES (?, ?, ?, ?, ?)"
    ).run(crypto.randomUUID(), email, name || "", hashedPassword, "student")

    const sessionId = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    db.prepare(
      "INSERT OR REPLACE INTO sessions (id, userId, expiresAt) VALUES (?, ?, ?)"
    ).run(sessionId, result.lastInsertRowid, expiresAt.toISOString())

    const response = new Response(JSON.stringify({ 
      success: true, 
      user: { id: result.lastInsertRowid, email, name: name || "", role: "student" } 
    }))

    response.cookies.set("session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    })

    return response
  }

  if (action === 'login') {
    const { email, password } = rest

    const user = db.prepare("SELECT id, email, name, password, role FROM users WHERE email = ?")
      .get(email) as { id: number; email: string; name: string; password: string; role: string } | undefined

    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    const passwordValid = await verifyPassword(password, user.password)

    if (!passwordValid) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    const sessionId = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    db.prepare(
      "INSERT OR REPLACE INTO sessions (id, userId, expiresAt) VALUES (?, ?, ?)"
    ).run(sessionId, user.id, expiresAt.toISOString())

    const response = new Response(JSON.stringify({ 
      success: true, 
      user: { id: user.id, email: user.email, name: user.name, role: user.role } 
    }))

    response.cookies.set("session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    })

    return response
  }

  if (action === 'logout') {
    const cookie = req.cookies.get('session')
    if (cookie) {
      db.prepare("DELETE FROM sessions WHERE id = ?").run(cookie.value)
    }

    const response = new Response(JSON.stringify({ success: true }))

    response.cookies.set("session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    })

    return response
  }

  return new Response(JSON.stringify({ error: "Unknown action" }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  })
}