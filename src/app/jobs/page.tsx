type Job = {
  id: number
  title: string
  category: string
  salary: number
}

export default async function JobsPage() {
  const res = await fetch(`${process.env.BASE_URL}/api/jobs`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    return <div>データの取得に失敗しました</div>
  }

  const { jobs }:{jobs:Job[]} = await res.json()

  return (
    <ul>
      {jobs.map((job) => (
        <li key={job.id}>
          <h2>{job.title}</h2>
          <p>{job.category}</p>
          <p>{job.salary} 万円</p>
        </li>
      ))}
    </ul>
  )
}