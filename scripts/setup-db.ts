import { db } from "../lib/db"

async function setupDatabase() {
  try {
    console.log("Setting up MongoDB database...")

    // Initialize the database with sample data
    await db.initializeDatabase()

    console.log("Database setup completed successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Error setting up database:", error)
    process.exit(1)
  }
}

setupDatabase()
