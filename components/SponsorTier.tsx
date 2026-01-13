interface SponsorTierProps {
  title: string
  sponsors: { name: string }[]
  desktopCols?: 2 | 4
}

export default function SponsorTier({
  title,
  sponsors,
  desktopCols = 4,
}: SponsorTierProps) {

  const gridCols =
    desktopCols === 2
      ? "grid-cols-2 md:grid-cols-2"
      : "grid-cols-2 md:grid-cols-4"

  return (
    <section className="w-full flex flex-col items-center mt-16 md:mt-24 mb-14 px-4">

      {/* Tier title */}
      <div
        className="
          inline-flex
          px-7 md:px-10
          py-3
          border border-white/60
          text-white
          text-sm md:text-base
          font-semibold
          uppercase
          tracking-[0.1em]
          rounded-[3px]
          mb-14
        "
      >
        {title}
      </div>

      {/* Sponsors grid */}
      <div
        className={`
          grid
          ${gridCols}
          gap-x-10 md:gap-x-20
          gap-y-16 md:gap-y-20
          justify-items-center
          w-full
          max-w-[1100px]
          mx-auto
        `}
      >
        {sponsors.map((s, i) => (
          <div key={i} className="flex flex-col items-center">

            {/* Sponsor image box */}
            <div
              className="
                w-[180px] h-[135px]
                sm:w-[200px] sm:h-[150px]
                md:w-[220px] md:h-[160px]
                bg-white
                border border-[#333]
                rounded-[10px]
                shadow-md
                flex items-center justify-center
                overflow-hidden
              "
            >
              {/* Sponsor logo goes here */}
            </div>

            {/* Name plate */}
            <div
              className="
                mt-5
                px-5 py-1.5
                min-w-[130px]
                max-w-[220px]
                text-center
                bg-transparent
                border border-[#4A4A4A]
                rounded-[4px]
              "
            >
              <p
                className="
                  text-[14px] sm:text-[15px] md:text-[16px]
                  text-white/95
                  font-semibold
                  leading-snug
                  break-words
                "
              >
                {s.name || "Name"}
              </p>
            </div>

          </div>
        ))}
      </div>
    </section>
  )
}
