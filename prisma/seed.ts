import Database from "better-sqlite3";

const db = new Database("./dev.db");

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    name TEXT,
    emailVerified TEXT,
    image TEXT,
    password TEXT,
    role TEXT DEFAULT 'student',
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS activity_categories (
    id TEXT PRIMARY KEY,
    name TEXT,
    description TEXT,
    points INTEGER,
    category TEXT,
    code TEXT,
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS activity_submissions (
    id TEXT PRIMARY KEY,
    studentId TEXT,
    categoryId TEXT,
    title TEXT,
    description TEXT,
    proofUrl TEXT,
    status TEXT DEFAULT 'pending',
    pointsAwarded INTEGER,
    submittedAt TEXT DEFAULT (datetime('now')),
    verifiedAt TEXT,
    verifiedBy TEXT,
    FOREIGN KEY (studentId) REFERENCES users(id),
    FOREIGN KEY (categoryId) REFERENCES activity_categories(id)
  );

  CREATE TABLE IF NOT EXISTS admin_reviews (
    id TEXT PRIMARY KEY,
    submissionId TEXT,
    adminId TEXT,
    status TEXT,
    adminNotes TEXT,
    reviewedAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (submissionId) REFERENCES activity_submissions(id),
    FOREIGN KEY (adminId) REFERENCES users(id)
  );
`)

// Check if password column exists, if not add it
const usersInfo = db.prepare("PRAGMA table_info(users)").all();
const userColumnNames = (usersInfo as { name: string }[]).map(c => c.name);

if (!userColumnNames.includes("password")) {
  db.prepare("ALTER TABLE users ADD COLUMN password TEXT").run();
  console.log("Added password column to users table");
}

const categories = [
  // Technical Events
  ['Technical Codeathon', 'Software development competition', 150, 'technical', 'KTU24-TECH-001'],
  ['Hackathon', '24/48-hour innovation challenge', 200, 'technical', 'KTU24-TECH-002'],
  ['Debugathon', 'Debugging competition', 100, 'technical', 'KTU24-TECH-003'],
  ['Project Expo', 'Project exhibition and competition', 120, 'technical', 'KTU24-TECH-004'],
  // Coding Competitions
  ['Technical Quiz', 'Technical knowledge competition', 80, 'technical', 'KTU24-TECH-005'],
  ['Code Review', 'Code review competition', 60, 'technical', 'KTU24-TECH-006'],
  // Workshops and Training
  ['Workshop', 'Technical workshop participation', 50, 'technical', 'KTU24-TECH-007'],
  ['Training Program', 'Skill training program', 70, 'technical', 'KTU24-TECH-008'],
  // Technical Seminars
  ['Technical Seminar', 'Technical seminar attendance', 40, 'technical', 'KTU24-TECH-009'],
  ['Guest Lecture', 'Guest lecture attendance', 50, 'technical', 'KTU24-TECH-010'],
  // Cultural Events
  ['Cultural Fest', 'Cultural festival participation', 100, 'cultural', 'KTU24-CULT-001'],
  ['Music Competition', 'Music competition participation', 70, 'cultural', 'KTU24-CULT-002'],
  ['Dance Competition', 'Dance competition participation', 70, 'cultural', 'KTU24-CULT-003'],
  ['Art Competition', 'Art competition participation', 60, 'cultural', 'KTU24-CULT-004'],
  // Sports Events
  ['Sports Meet', 'Sports meet participation', 80, 'sports', 'KTU24-SPOR-001'],
  ['Athletics', 'Athletics competition', 60, 'sports', 'KTU24-SPOR-002'],
  ['Sports Tournament', 'Sports tournament participation', 90, 'sports', 'KTU24-SPOR-003'],
  // Leadership and Club Activities
  ['Club Leadership', 'Club leadership role', 150, 'leadership', 'KTU24-LEAD-001'],
  ['Event Organization', 'Event organization', 100, 'leadership', 'KTU24-LEAD-002'],
  ['Club Membership', 'Active club membership', 40, 'leadership', 'KTU24-LEAD-003'],
  // Research and Publications
  ['Research Paper', 'Research paper publication', 200, 'research', 'KTU24-RES-001'],
  ['Research Presentation', 'Research presentation at conference', 120, 'research', 'KTU24-RES-002'],
  // Community Service
  ['Community Service', 'Community service activity', 60, 'community', 'KTU24-COMM-001'],
  ['Social Initiative', 'Social initiative participation', 80, 'community', 'KTU24-COMM-002'],
];

const insertCategory = db.prepare(
  "INSERT OR IGNORE INTO activity_categories (id, name, description, points, category, code) VALUES (?, ?, ?, ?, ?, ?)"
);

for (const cat of categories) {
  const id = crypto.randomUUID();
  insertCategory.run(id, ...cat);
}

const row = db.prepare("SELECT COUNT(*) as count FROM activity_categories").get() as { count: number }
const count = row.count;
console.log(`Seeded ${categories.length} KTU 2024 Scheme activity categories`);
console.log(`Total categories in database: ${count}`);

db.close();
console.log("Database setup complete!");