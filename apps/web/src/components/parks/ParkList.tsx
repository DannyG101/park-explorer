import { ParkCard } from './ParkCard'

type ParkListProps = {
  parks: {
    id: number
    name: string
    description: string
    openingDate: string | null
    cityId: number
    latitude: number
    longitude: number
  }[]
}

export function ParkList({ parks }: ParkListProps) {
  return (
    <div className="grid gap-4">
      {parks.map((park) => (
        <ParkCard
          key={park.id}
          park={park}
        />
      ))}
    </div>
  )
}