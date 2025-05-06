// lib/fetchJobs.ts
import pool from './db'

export const fetchJobs = async () => {
  try {
    const result = await pool.query('SELECT * FROM jobs ORDER BY id DESC')
    return result.rows
  } catch (error) {
    console.error('PostgreSQL fetch error:', error)
    return []
  }
}