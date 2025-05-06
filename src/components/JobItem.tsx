// src/components/JobItem.tsx
type JobItemProps = {
  title: string
  salary: number
}

export default function JobItem({ title, salary }: JobItemProps) {
  return (
    <li>
      {title} - {salary}万円
    </li>
  )
}
