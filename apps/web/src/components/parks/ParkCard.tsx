import { Link } from 'react-router-dom'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

type ParkCardProps = {
  park: {
    id: number
    name: string
    description: string
    openingDate: string | null
    cityId: number
    latitude: number
    longitude: number
  }
}

export function ParkCard({ park }: ParkCardProps) {
  return (
    <Link to={`/parks/${park.id}`}>
      <Card>
        <CardHeader>
          <CardTitle>{park.name}</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-2">
          <p>{park.description}</p>

          <p>
            Opening date: {park.openingDate ?? 'Not provided'}
          </p>

          <p>City ID: {park.cityId}</p>

          <p>
            Coordinates: {park.latitude}, {park.longitude}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
