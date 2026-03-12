'use-client'
export default function Header({}) {
  const nav = ['Home', 'Guides', 'Experiences', 'Map', 'About']

  return (
    <div>
      <div className="w-full bg-[#5f6d57] text-[#f8f3eb]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 text-sm">
          <div className="flex flex-wrap items-center gap-6 opacity-90">
            <span>Earth-rooted spiritual discovery</span>
            <span>Find healers, readers, and gatherings near you</span>
          </div>
          <div className="flex items-center gap-4 opacity-90">
            <span>Instagram</span>
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
                href={`/${item.toLowerCase()}`}
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
    </div>
  )
}
