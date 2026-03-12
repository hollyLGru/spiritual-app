import Map from '@/components/Map'
import profiles from '@/data/profiles'
import Header from '@/components/Header'

export default function MapPage() {
  return (
    <div>
      <Header />
      <Map profiles={profiles} />
    </div>
  )
}
