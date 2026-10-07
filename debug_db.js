const Database = require("better-sqlite3");
const db = new Database("./dev.db");

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log("Tables:", tables.map(t => t.name));

const users = db.prepare("PRAGMA table_info(users)").all();
console.log("Users columns:", users.map(c => c.name));

const activities = db.prepare("PRAGMA table_info(activity_categories)").all();
console.log("Activity categories columns:", activities.map(c => c.name));