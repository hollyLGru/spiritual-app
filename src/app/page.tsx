import profiles from '@/data/profiles'
import HomePage from '@/components/HomePage'
import Header from '@/components/Header'
import tags from '@/data/tags'
import services from '@/data/services'

export default function Home() {
  return (
    <main>
      <Header />
      <HomePage services={services} tags={tags} profiles={profiles} />
    </main>
  )
}
