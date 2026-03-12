'use client'
import Link from 'next/link'
import ElissaDougherty from '@/data/images/ElissaDougherty.png'
import Image from 'next/image'
export default function ProfilePreviewCard({ profile }) {
  //   const birthDate = new Date(profile.birthday)
  //   const today = new Date()
  //   let age = today.getFullYear() - birthDate.getFullYear()
  //   const hasHadBirthdayThisYear =
  //     today.getMonth() > birthDate.getMonth() ||
  //     (today.getMonth() === birthDate.getMonth() &&
  //       today.getDate() >= birthDate.getDate())

  //   if (!hasHadBirthdayThisYear) age--

  const age = 55

  return (
    <div className="rounded-[36px] border border-[#d9ccb7] bg-[#f8f3eb] p-4 shadow-xl shadow-[#a08a6c]/10">
      <div className="w-full rounded-3xl border border-[#e6dfd4] bg-white p-8 shadow-sm transition hover:shadow-md">
        {/* Top section */}
        <div className="flex items-start gap-5">
          <Image
            src={ElissaDougherty.src}
            alt={profile.Name}
            width={120}
            height={120}
            className="h-[120px] w-[120px] rounded-full border border-[#e4dbce] object-cover"
          />

          <div className="flex min-h-[120px] flex-col justify-center">
            <h3 className="font-serif text-3xl text-[#3a2f25]">
              {profile.Name}
            </h3>
            <p className="mt-2 text-base text-[#6f6257]">
              {profile.city}, {profile.state}
            </p>
            <p className="mt-1 text-base text-[#6f6257]">{age} years old</p>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <p className="text-[15px] leading-7 text-[#5e5246]">
            {profile.description}
          </p>
        </div>

        {/* Tags + button */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {profile.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#f3efe8] px-3 py-1.5 text-xs font-medium text-[#6d5f52]"
            >
              {tag}
            </span>
          ))}

          <Link
            href={`/guides/${profile.id}`}
            className="ml-auto inline-block rounded-full bg-[#7b5c45] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#6b4f3c]"
          >
            View profile
          </Link>
        </div>
      </div>
    </div>
  )
}
