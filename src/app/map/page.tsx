import Map from '@/components/Map'
import profiles from '@/data/profiles'

export default function MapPage() {
  return (
    <main className="p-6">
      <Map profiles={profiles} />
    </main>
  )
}
