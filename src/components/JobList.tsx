// src/components/JobList.tsx
import JobItem from './JobItem'

type Job = {
  id: number
  title: string
  salary: number
}

type JobListProps = {
  jobs: Job[]
}

export default function JobList({ jobs }: JobListProps) {
  return (
    <ul>
      {jobs.map((job) => (
        <JobItem key={job.id} title={job.title} salary={job.salary} />
      ))}
    </ul>
  )
}
