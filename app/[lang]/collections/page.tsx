import { Section } from "@/components/layout/section"

const collections = [
  { name: "Persian Rugs", description: "Timeless artistry from the heart of ancient Persia.", slug: "persian" },
  { name: "Afghan Rugs", description: "Bold geometric patterns rooted in nomadic tradition.", slug: "afghan" },
  { name: "Oriental Rugs", description: "Exquisite craftsmanship from the Silk Road.", slug: "oriental" },
  { name: "Vintage Rugs", description: "Distressed patina and historical character.", slug: "vintage" },
  { name: "Modern Rugs", description: "Contemporary designs for minimalist spaces.", slug: "modern" },
  { name: "Luxury Rugs", description: "Pure silk and fine weaves for the discerning.", slug: "luxury" },
]

export default function CollectionsPage() {
  return (
    <>
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden bg-surface-container-high">
        <div className="absolute inset-0 bg-black/20 z-10" />
        <div className="relative z-20 text-center px-margin-mobile">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-4">
            Our Collections
          </h1>
          <p className="font-body-lg text-body-lg text-white/90 max-w-xl mx-auto">
            Curated selections spanning centuries of weaving tradition.
          </p>
        </div>
      </section>

      <Section background="none">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {collections.map((collection) => (
            <div
              key={collection.name}
              className="relative group h-[500px] overflow-hidden bg-surface-container-high"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8">
                <h3 className="text-white font-headline-sm text-headline-sm">
                  {collection.name}
                </h3>
                <p className="text-white/70 font-body-md text-body-md mt-2 max-w-xs">
                  {collection.description}
                </p>
                <span className="text-white/80 font-label-sm text-label-sm uppercase tracking-widest mt-4 block hover:text-secondary-fixed transition-colors">
                  Explore Collection
                </span>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}
