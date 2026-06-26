import type {
  HowItWorksStep,
  PricingPlan,
  Review,
  SiteConfig,
  SiteData,
  Teacher,
} from '../types'
import { env } from '../config/env'
import { sanitizeImageUrl, sanitizeText } from '../utils/sanitize'

const FALLBACK_DATA: SiteData = {
  config: {
    logoUrl: '',
    brandName: 'Maklein',
    heroTitle: 'Английский язык с уверенностью',
    heroSubtitle:
      'Персональные и групповые занятия с сертифицированными преподавателями. Гибкий график, практика с первого дня.',
    heroCtaText: 'Начать обучение',
    heroImageUrl:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
  },
  howItWorks: [
    {
      id: '1',
      step: 1,
      title: 'Диагностика уровня',
      description:
        'Определяем ваш текущий уровень и цели: работа, учёба, путешествия или общее развитие.',
      icon: 'target',
    },
    {
      id: '2',
      step: 2,
      title: 'Персональный план',
      description:
        'Составляем программу с учётом вашего расписания и приоритетов в обучении.',
      icon: 'plan',
    },
    {
      id: '3',
      step: 3,
      title: 'Живые занятия',
      description:
        'Онлайн-уроки с преподавателем, интерактивные материалы и домашние задания.',
      icon: 'video',
    },
    {
      id: '4',
      step: 4,
      title: 'Прогресс и поддержка',
      description:
        'Регулярная обратная связь, отслеживание результатов и корректировка плана.',
      icon: 'chart',
    },
  ],
  teachers: [
    {
      id: '1',
      name: 'Елена Морозова',
      role: 'Senior English Teacher',
      bio: '10 лет опыта, Cambridge CELTA. Специализация: бизнес-английский и подготовка к IELTS.',
      imageUrl:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
      experience: '10 лет',
    },
    {
      id: '2',
      name: 'James Anderson',
      role: 'Native Speaker',
      bio: 'Преподаватель из Лондона. Фокус на разговорную практику и произношение.',
      imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
      experience: '8 лет',
    },
    {
      id: '3',
      name: 'Анна Коваль',
      role: 'English Teacher',
      bio: 'Помогает студентам уверенно говорить с нуля. Методика: коммуникативный подход.',
      imageUrl:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
      experience: '6 лет',
    },
  ],
  reviews: [
    {
      id: '1',
      author: 'Мария С.',
      text: 'Через 3 месяца начала свободно общаться на работе с международными коллегами. Преподаватели очень внимательные.',
      rating: 5,
      avatarUrl:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    },
    {
      id: '2',
      author: 'Дмитрий К.',
      text: 'Гибкий график и понятная структура уроков. Уровень поднял с Intermediate до Advanced.',
      rating: 5,
      avatarUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    },
    {
      id: '3',
      author: 'Ольга В.',
      text: 'Дочь с удовольствием занимается. Видим реальный прогресс каждую неделю.',
      rating: 5,
      avatarUrl:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
    },
  ],
  pricing: [
    {
      id: 'basic',
      name: 'Базовый',
      price: '4 900',
      period: 'месяц',
      description: 'Для самостоятельного старта с поддержкой куратора',
      features: [
        '2 занятия в неделю',
        'Доступ к материалам',
        'Чат с куратором',
        'Домашние задания',
      ],
      highlighted: false,
      ctaText: 'Выбрать план',
    },
    {
      id: 'standard',
      name: 'Стандарт',
      price: '7 900',
      period: 'месяц',
      description: 'Оптимальный баланс практики и интенсивности',
      features: [
        '3 занятия в неделю',
        'Персональный план',
        'Разговорный клуб',
        'Проверка домашних заданий',
        'Отчёт о прогрессе',
      ],
      highlighted: true,
      ctaText: 'Выбрать план',
    },
    {
      id: 'premium',
      name: 'Премиум',
      price: '12 900',
      period: 'месяц',
      description: 'Максимальный результат в короткий срок',
      features: [
        '5 занятий в неделю',
        'Индивидуальный куратор',
        'Подготовка к экзаменам',
        'Приоритетная поддержка',
        'Бесплатный разговорный клуб',
      ],
      highlighted: false,
      ctaText: 'Выбрать план',
    },
  ],
}

function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = []
  let current = ''
  let inQuotes = false
  let row: string[] = []

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const next = text[i + 1]

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      row.push(current.trim())
      current = ''
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i++
      row.push(current.trim())
      if (row.some((cell) => cell.length > 0)) rows.push(row)
      row = []
      current = ''
    } else {
      current += char
    }
  }

  if (current.length > 0 || row.length > 0) {
    row.push(current.trim())
    if (row.some((cell) => cell.length > 0)) rows.push(row)
  }

  if (rows.length === 0) return []

  const headers = rows[0].map((h) => h.toLowerCase().trim())
  return rows.slice(1).map((cells) => {
    const record: Record<string, string> = {}
    headers.forEach((header, index) => {
      record[header] = cells[index] ?? ''
    })
    return record
  })
}

async function fetchSheetCsv(sheetName: string): Promise<Record<string, string>[]> {
  if (!env.googleSheetId) {
    throw new Error('VITE_GOOGLE_SHEET_ID не задан в .env')
  }

  const url = `https://docs.google.com/spreadsheets/d/${env.googleSheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Не удалось загрузить вкладку «${sheetName}»: HTTP ${response.status}`)
  }

  const text = await response.text()

  if (!text.trim()) {
    throw new Error(`Вкладка «${sheetName}» пуста`)
  }

  return parseCsv(text)
}

function mapConfig(rows: Record<string, string>[]): SiteConfig {
  const row = rows[0] ?? {}
  return {
    logoUrl: sanitizeImageUrl(row.logo_url ?? row.logourl ?? ''),
    brandName: sanitizeText(row.brand_name ?? row.brandname ?? 'Maklein', 100),
    heroTitle: sanitizeText(
      row.hero_title ?? row.herotitle ?? FALLBACK_DATA.config.heroTitle,
      200,
    ),
    heroSubtitle: sanitizeText(
      row.hero_subtitle ?? row.herosubtitle ?? FALLBACK_DATA.config.heroSubtitle,
      500,
    ),
    heroCtaText: sanitizeText(
      row.hero_cta_text ?? row.heroctatext ?? FALLBACK_DATA.config.heroCtaText,
      50,
    ),
    heroImageUrl:
      sanitizeImageUrl(row.hero_image_url ?? row.heroimageurl ?? '') ||
      FALLBACK_DATA.config.heroImageUrl,
  }
}

function mapHowItWorks(rows: Record<string, string>[]): HowItWorksStep[] {
  return rows.map((row, index) => ({
    id: sanitizeText(row.id ?? String(index + 1), 20),
    step: Number(row.step ?? index + 1),
    title: sanitizeText(row.title ?? '', 200),
    description: sanitizeText(row.description ?? '', 500),
    icon: sanitizeText(row.icon ?? 'target', 20),
  }))
}

function mapTeachers(rows: Record<string, string>[]): Teacher[] {
  return rows.map((row, index) => ({
    id: sanitizeText(row.id ?? String(index + 1), 20),
    name: sanitizeText(row.name ?? '', 100),
    role: sanitizeText(row.role ?? '', 100),
    bio: sanitizeText(row.bio ?? '', 500),
    imageUrl: sanitizeImageUrl(row.image_url ?? row.imageurl ?? ''),
    experience: sanitizeText(row.experience ?? '', 50),
  }))
}

function mapReviews(rows: Record<string, string>[]): Review[] {
  return rows.map((row, index) => ({
    id: sanitizeText(row.id ?? String(index + 1), 20),
    author: sanitizeText(row.author ?? '', 100),
    text: sanitizeText(row.text ?? '', 1000),
    rating: Math.min(5, Math.max(1, Number(row.rating ?? 5) || 5)),
    avatarUrl: sanitizeImageUrl(row.avatar_url ?? row.avatarurl ?? ''),
  }))
}

function mapPricing(rows: Record<string, string>[]): PricingPlan[] {
  return rows.map((row, index) => ({
    id: sanitizeText(row.id ?? String(index + 1), 20),
    name: sanitizeText(row.name ?? '', 100),
    price: sanitizeText(row.price ?? '', 20),
    period: sanitizeText(row.period ?? 'месяц', 20),
    description: sanitizeText(row.description ?? '', 300),
    features: (row.features ?? '')
      .split('|')
      .map((f) => sanitizeText(f.trim(), 200))
      .filter(Boolean),
    highlighted: ['true', '1', 'yes'].includes(
      (row.highlighted ?? '').toLowerCase().trim(),
    ),
    ctaText: sanitizeText(row.cta_text ?? row.ctatext ?? 'Выбрать план', 50),
  }))
}

export async function fetchSiteData(): Promise<SiteData> {
  if (!env.isConfigured) {
    console.warn('[Maklein] Google Sheet ID не задан — используются демо-данные')
    return FALLBACK_DATA
  }

  const [configRows, howRows, teacherRows, reviewRows, pricingRows] =
    await Promise.all([
      fetchSheetCsv(env.sheets.config),
      fetchSheetCsv(env.sheets.howItWorks),
      fetchSheetCsv(env.sheets.teachers),
      fetchSheetCsv(env.sheets.reviews),
      fetchSheetCsv(env.sheets.pricing),
    ])

  return {
    config: mapConfig(configRows),
    howItWorks: mapHowItWorks(howRows),
    teachers: mapTeachers(teacherRows),
    reviews: mapReviews(reviewRows),
    pricing: mapPricing(pricingRows),
  }
}

export { FALLBACK_DATA }
