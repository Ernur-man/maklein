import { useSiteData } from '../../context/SiteDataContext'
import { SectionTitle } from '../ui/SectionTitle'

export function Teachers() {
  const { data } = useSiteData()
  if (!data) return null

  return (
    <section id="teachers" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle
          title="Наши преподаватели"
          subtitle="Сертифицированные специалисты с международным опытом"
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.teachers.map((teacher) => (
            <article
              key={teacher.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  src={teacher.imageUrl}
                  alt={teacher.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80'
                  }}
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {teacher.name}
                    </h3>
                    <p className="text-sm text-slate-500">{teacher.role}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {teacher.experience}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {teacher.bio}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
