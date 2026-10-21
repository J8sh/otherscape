import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { GUIDE, GUIDE_BY_SLUG } from '@/lib/guide'

export function generateStaticParams() {
  return GUIDE.filter(t => t.body !== null).map(t => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const topic = GUIDE_BY_SLUG[slug]
  return { title: topic ? `${topic.title} · Rules Guide` : 'Rules Guide' }
}

export default async function GuideTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const topic = GUIDE_BY_SLUG[slug]
  if (!topic || topic.body === null) notFound()
  const i = GUIDE.indexOf(topic)
  const prev = GUIDE[i - 1]
  const next = GUIDE[i + 1]

  return (
    <article className="max-w-3xl mx-auto px-4 md:px-8 py-8">
      <Link href="/guide" className="inline-flex items-center gap-1.5 font-display tracking-widest text-sm hover:text-white" style={{ color: 'var(--text-muted)', minHeight: 32 }}>
        <ArrowLeft size={14} aria-hidden /> RULES GUIDE
      </Link>
      <h1 className="font-display text-4xl md:text-5xl tracking-wide mt-2">{topic.title}</h1>
      <p className="mt-1" style={{ color: 'var(--text-muted)' }}>
        {topic.summary}{topic.pages && <> · <span className="whitespace-nowrap">Core book {topic.pages}</span></>}
      </p>
      <div className="guide-prose mt-6">{topic.body}</div>

      <nav aria-label="More topics" className="grid grid-cols-2 gap-3 mt-10">
        {prev ? (
          <Link href={`/guide/${prev.slug}`} className="panel p-3 hover:border-[#c8ff00]">
            <div className="text-xs font-display tracking-widest flex items-center gap-1" style={{ color: 'var(--text-muted)' }}><ArrowLeft size={12} aria-hidden /> PREVIOUS</div>
            <div className="font-semibold">{prev.title}</div>
          </Link>
        ) : <span />}
        {next && (
          <Link href={`/guide/${next.slug}`} className="panel p-3 text-right hover:border-[#c8ff00]">
            <div className="text-xs font-display tracking-widest flex items-center justify-end gap-1" style={{ color: 'var(--text-muted)' }}>NEXT <ArrowRight size={12} aria-hidden /></div>
            <div className="font-semibold">{next.title}</div>
          </Link>
        )}
      </nav>
    </article>
  )
}
