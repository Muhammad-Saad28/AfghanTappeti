import type { Metadata } from "next"
import { getDictionary, type Locale } from "@/lib/i18n"
import { siteUrl } from "@/lib/seo"
import { Section } from "@/components/layout/section"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const t = await getDictionary(lang as Locale)
  return {
    title: t.contact.title,
    alternates: {
      canonical: `${siteUrl}/${lang}/contact`,
      languages: { en: `${siteUrl}/en/contact`, it: `${siteUrl}/it/contact`, "x-default": `${siteUrl}/en/contact` },
    },
  }
}

export default async function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden bg-surface-container-high">
        <div className="absolute inset-0 bg-black/20 z-10" />
        <div className="relative z-20 text-center px-margin-mobile">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-4">
            Get in Touch
          </h1>
          <p className="font-body-lg text-body-lg text-white/90 max-w-xl mx-auto">
            We&apos;d love to hear from you. Whether you have a question about
            a rug or need design advice, our team is here to help.
          </p>
        </div>
      </section>

      {/* Contact Form + Details */}
      <Section background="none">
        <div className="grid md:grid-cols-2 gap-24">
          <div>
            <h2 className="font-headline-sm text-headline-sm mb-8">
              Send Us a Message
            </h2>
            <form className="space-y-8">
              <div>
                <label
                  htmlFor="name"
                  className="font-label-sm text-label-sm text-on-surface-variant block mb-1"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full bg-transparent border-b border-outline-variant py-3 focus:outline-none focus:border-secondary transition-colors font-body-md"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="font-label-sm text-label-sm text-on-surface-variant block mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full bg-transparent border-b border-outline-variant py-3 focus:outline-none focus:border-secondary transition-colors font-body-md"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="font-label-sm text-label-sm text-on-surface-variant block mb-1"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  className="w-full bg-transparent border-b border-outline-variant py-3 focus:outline-none focus:border-secondary transition-colors font-body-md"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="font-label-sm text-label-sm text-on-surface-variant block mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full bg-transparent border-b border-outline-variant py-3 focus:outline-none focus:border-secondary transition-colors font-body-md resize-none"
                />
              </div>
              <button
                type="submit"
                className="bg-primary text-white px-12 py-4 font-label-md text-label-md hover:bg-secondary transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          <div>
            <h2 className="font-headline-sm text-headline-sm mb-8">
              Contact Information
            </h2>
            <div className="space-y-8">
              <div>
                <h4 className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-2">
                  Address
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Via dei Tessitori 24
                  <br />
                  50123 Florence, Italy
                </p>
              </div>
              <div>
                <h4 className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-2">
                  Phone
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  +39 055 123 4567
                </p>
              </div>
              <div>
                <h4 className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-2">
                  Email
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  info@afghantappeti.com
                </p>
              </div>
              <div>
                <h4 className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-2">
                  Business Hours
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Monday &ndash; Friday: 9:00 AM &ndash; 6:00 PM
                  <br />
                  Saturday: 10:00 AM &ndash; 4:00 PM
                  <br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
