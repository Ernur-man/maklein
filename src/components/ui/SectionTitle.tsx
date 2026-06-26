interface SectionTitleProps {
  title: string
  subtitle?: string
  id?: string
}

export function SectionTitle({ title, subtitle, id }: SectionTitleProps) {
  return (
    <div id={id} className="mx-auto max-w-2xl text-center">
      <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base text-slate-600 sm:text-lg">{subtitle}</p>
      )}
    </div>
  )
}
