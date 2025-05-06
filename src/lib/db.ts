// lib/db.ts
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // ← SupabaseのConnection stringでもOK
})

export default pool