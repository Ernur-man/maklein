import { useSiteData } from '../../context/SiteDataContext'
import { SectionTitle } from '../ui/SectionTitle'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`Оценка: ${rating} из 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={i < rating ? 'text-amber-400' : 'text-slate-300'}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  )
}

export function Reviews() {
  const { data } = useSiteData()
  if (!data) return null

  return (
    <section id="reviews" className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle
          title="Отзывы студентов"
          subtitle="Реальные истории людей, которые достигли своих целей"
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <StarRating rating={review.rating} />
              <blockquote className="mt-4 text-sm leading-relaxed text-slate-600">
                «{review.text}»
              </blockquote>
              <footer className="mt-6 flex items-center gap-3">
                <img
                  src={review.avatarUrl}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover bg-slate-100"
                  onError={(e) => {
                    e.currentTarget.style.visibility = 'hidden'
                  }}
                />
                <cite className="text-sm font-medium not-italic text-slate-900">
                  {review.author}
                </cite>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
