import Link from 'next/link'
import ProfilePreviewCard from './ProfilePreviewCard'

export default function HomePage({ services, tags, profiles }) {
  return (
    <div className="min-h-screen bg-[#f6f1e7] text-[#3d342b]">
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

          {/* <div className="relative z-10">
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
          </div> */}
          <ProfilePreviewCard profile={profiles[1]} />
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
            <Link
              href={`/guides`}
              className="rounded-full bg-[#5f6d57] px-6 py-3 font-medium text-white"
            >
              Browse guides
            </Link>
            <Link
              href={`/map`}
              className="rounded-full border border-[#cdbca6] bg-[#efe6d9] px-6 py-3 font-medium text-[#5a4b3c]"
            >
              View map
            </Link>
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
              <Link
                href={`/services/${service.title}`}
                className="mt-6 text-sm font-medium text-[#7b5c45] underline underline-offset-4"
              >
                Explore this category
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
