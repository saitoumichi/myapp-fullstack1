// app/api/jobs/route.ts
import { NextResponse } from 'next/server'
import pool from '@/lib/db' // PostgreSQL用のPoolをインポート

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, category, salary } = body

    const result = await pool.query(
      'INSERT INTO jobs (title, category, salary) VALUES ($1, $2, $3) RETURNING *',
      [title, category, salary]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('PostgreSQL INSERT error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 })
    }
  }
}
export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM jobs ORDER BY id DESC');
    return NextResponse.json({ jobs: result.rows }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}