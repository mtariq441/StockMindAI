import { StatCard } from '../stat-card'
import { Package } from 'lucide-react'

export default function StatCardExample() {
  return (
    <div className="p-4">
      <StatCard
        title="Total Products"
        value="1,234"
        icon={Package}
        trend={{ value: "12%", positive: true }}
      />
    </div>
  )
}
