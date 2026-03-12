export default function Test() {
  const nav = ['Home', 'Guides', 'Experiences', 'Map', 'Community', 'Contact']
  const services = [
    {
      title: 'Meditation & Breathwork',
      desc: 'Find grounded teachers for private sessions, circles, and guided journeys.',
      badge: 'Calm & Centering',
    },
    {
      title: 'Somatic & Energy Healing',
      desc: 'Explore practitioners offering body-based healing, Reiki, and nervous system support.',
      badge: 'Embodied Healing',
    },
    {
      title: 'Intuitive Readings',
      desc: 'Connect with numerologists, psychics, tarot readers, and past-life guides.',
      badge: 'Insight & Clarity',
    },
  ]

  const tags = [
    'Meditation',
    'Somatic Healing',
    'Numerology',
    'Psychic Readings',
    'Past Life Regression',
    'Breathwork',
  ]

  return (
    <div className="min-h-screen bg-[#f6f1e7] text-[#3d342b]">
      <div className="w-full bg-[#5f6d57] text-[#f8f3eb]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 text-sm">
          <div className="flex flex-wrap items-center gap-6 opacity-90">
            <span>Earth-rooted spiritual discovery</span>
            <span>Find healers, readers, and gatherings near you</span>
          </div>
          <div className="flex items-center gap-4 opacity-90">
            <span>Instagram</span>
            <span>Community</span>
            <span>Login</span>
          </div>
        </div>
      </div>

      <header className="border-b border-[#d9ccb7] bg-[#f8f3eb]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div>
            <div className="font-serif text-4xl leading-none text-[#7b5c45]">
              SoulPath
            </div>
            <div className="mt-1 text-sm tracking-[0.25em] text-[#8a7a67] uppercase">
              Discover your spiritual community
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            {nav.map((item) => (
              <a
                key={item}
                href="#"
                className={`transition ${
                  item === 'Home'
                    ? 'rounded-full bg-[#b8875c] px-5 py-2 text-white shadow-sm'
                    : 'text-[#5b4d40] hover:text-[#7b5c45]'
                }`}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(181,147,112,0.25),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(95,109,87,0.18),_transparent_30%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
          <div className="relative z-10 max-w-2xl">
            <p className="mb-4 text-sm tracking-[0.3em] text-[#8f7b67] uppercase">
              Gentle guidance for seekers
            </p>
            <h1 className="font-serif text-5xl leading-tight text-[#3a2f25] md:text-7xl">
              Find the healer, guide, or experience that feels aligned.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#62554a]">
              Browse spiritual practitioners, explore local offerings on a map,
              and connect through grounded, heart-led experiences.
            </p>

            <div className="mt-8 flex flex-col gap-4 rounded-[28px] border border-[#dbcdb8] bg-white/80 p-4 shadow-sm backdrop-blur sm:flex-row">
              <input
                placeholder="Search meditation, reiki, psychics, cities..."
                className="flex-1 rounded-full border border-[#e4d9ca] bg-[#fcfaf6] px-5 py-3 text-[#4e4339] outline-none placeholder:text-[#a08f7d]"
              />
              <button className="rounded-full bg-[#7b5c45] px-6 py-3 font-medium text-white shadow-sm transition hover:bg-[#6b4f3c]">
                Explore
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#d8ccb9] bg-[#f8f2e9] px-4 py-2 text-sm text-[#6f5d50]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <div className="rounded-[36px] border border-[#d9ccb7] bg-[#f8f3eb] p-4 shadow-xl shadow-[#a08a6c]/10">
              <div className="rounded-[28px] bg-[linear-gradient(140deg,#b98d67_0%,#8d735c_35%,#5f6d57_100%)] p-8 text-white">
                <div className="text-sm tracking-[0.3em] text-white/80 uppercase">
                  Featured Guide
                </div>
                <div className="mt-10 rounded-[24px] bg-white/12 p-6 backdrop-blur">
                  <div className="font-serif text-3xl">Maya Sol</div>
                  <div className="mt-2 text-white/85">
                    Somatic Healing • Breathwork • Intuitive Guidance
                  </div>
                  <div className="mt-6 grid gap-3 text-sm text-white/90">
                    <div className="rounded-2xl bg-white/10 px-4 py-3">
                      Boulder, CO • 4.9 rating • Trauma-informed
                    </div>
                    <div className="rounded-2xl bg-white/10 px-4 py-3">
                      Private sessions, circles, retreats
                    </div>
                  </div>
                  <button className="mt-6 rounded-full bg-[#f4e8d4] px-5 py-3 font-medium text-[#5c4637] transition hover:bg-white">
                    View profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#ded2bf] bg-[#fbf8f3]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="font-serif text-4xl text-[#3a2f25] md:text-5xl">
              Are you ready to find your people?
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#64574d]">
              Discover trusted practitioners, meaningful experiences, and local
              spiritual communities in one calm, intentional space.
            </p>
          </div>

          <div className="flex gap-3">
            <button className="rounded-full bg-[#5f6d57] px-6 py-3 font-medium text-white">
              Browse guides
            </button>
            <button className="rounded-full border border-[#cdbca6] bg-[#efe6d9] px-6 py-3 font-medium text-[#5a4b3c]">
              View map
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm tracking-[0.25em] text-[#8f7b67] uppercase">
              Explore offerings
            </p>
            <h3 className="mt-2 font-serif text-4xl text-[#3a2f25]">
              Find services by path and practice
            </h3>
          </div>
          <div className="hidden text-sm text-[#7b6d61] md:block">
            Earthy, warm, and community-centered
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="rounded-[28px] border border-[#ded2bf] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div
                className={`mb-5 inline-flex rounded-full px-4 py-2 text-sm font-medium ${
                  index === 0
                    ? 'bg-[#ece4d3] text-[#7a5a45]'
                    : index === 1
                      ? 'bg-[#dde6d7] text-[#4f6250]'
                      : 'bg-[#eadfd7] text-[#8a6258]'
                }`}
              >
                {service.badge}
              </div>
              <h4 className="font-serif text-2xl text-[#33291f]">
                {service.title}
              </h4>
              <p className="mt-3 leading-7 text-[#65584d]">{service.desc}</p>
              <button className="mt-6 text-sm font-medium text-[#7b5c45] underline underline-offset-4">
                Explore this category
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
