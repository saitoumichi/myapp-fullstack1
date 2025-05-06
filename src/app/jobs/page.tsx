import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function JobsPage() {
  const supabase = createServerComponentClient({ cookies })

  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*')
    .order('id', { ascending: false })

  if (error) {
    return <div>データの取得に失敗しました: {error.message}</div>
  }

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">求人一覧（SSR）</h1>
      <ul className="space-y-3">
        {jobs?.map((job) => (
          <li key={job.id} className="border p-4 rounded shadow bg-white">
            <h2 className="text-md font-semibold">{job.title}</h2>
            <p className="text-sm text-gray-600">カテゴリ: {job.category}</p>
            <p className="text-sm text-gray-600">年収: {job.salary} 万円</p>
          </li>
        ))}
      </ul>
    </main>
  )
}
