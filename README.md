# Maklein — Landing Page

Современный landing page для курсов английского языка **Maklein**. Контент управляется через Google Sheets, заявки отправляются через Sheet Monkey.

## Архитектура

```
maklein-landing/
├── api/                       # Vercel Serverless (POST /api/register)
├── netlify/functions/         # Netlify Functions
├── server/                    # Общая логика регистрации (Turnstile, rate limit)
├── shared/                    # Общая валидация (клиент + сервер)
├── src/
│   ├── components/
│   │   ├── layout/            # Header, Footer
│   │   ├── sections/          # Hero, HowItWorks, Teachers, Reviews, Pricing, Registration
│   │   └── ui/                # Button, ErrorBanner, TurnstileField, ...
│   ├── context/
│   │   └── SiteDataContext.tsx
│   ├── services/
│   │   ├── googleSheets.ts    # Загрузка CSV + санитизация
│   │   └── sheetMonkey.ts     # POST → /api/register (прокси)
│   ├── utils/
│   │   └── sanitize.ts        # Валидация URL изображений
│   └── ...
├── vercel.json                # CSP + security headers
├── netlify.toml
└── .env.example
```

### Поток данных

```
Google Sheets (публичный CSV) → googleSheets.ts → UI

Форма → /api/register (serverless) → Turnstile verify → Sheet Monkey → приватная таблица заявок
```

## Быстрый старт

```bash
npm install
cp .env.example .env
npm run dev
```

Откройте http://localhost:5173

**Без `.env`** сайт работает с встроенными демо-данными.

## Настройка Google Sheets

1. Создайте Google Spreadsheet с вкладками:

### `config` (одна строка данных)

| logo_url | brand_name | hero_title | hero_subtitle | hero_cta_text | hero_image_url |
|----------|------------|------------|---------------|---------------|----------------|

### `how_it_works`

| id | step | title | description | icon |
|----|------|-------|-------------|------|
| 1 | 1 | Диагностика уровня | ... | target |

Иконки: `target`, `plan`, `video`, `chart`

### `teachers`

| id | name | role | bio | image_url | experience |

### `reviews`

| id | author | text | rating | avatar_url |

### `pricing`

| id | name | price | period | description | features | highlighted | cta_text |
|----|------|-------|--------|-------------|----------|-------------|----------|

`features` — пункты через `|` (например: `2 занятия|Материалы|Чат`)

`highlighted` — `true` / `false`

2. **File → Share → Publish to web** (или сделайте таблицу доступной по ссылке)
3. Скопируйте ID таблицы из URL: `docs.google.com/spreadsheets/d/{ID}/edit`
4. Добавьте в `.env`:

```env
VITE_GOOGLE_SHEET_ID=your_spreadsheet_id
```

## Настройка Sheet Monkey и Turnstile

1. Создайте **отдельную приватную** Google Sheet для заявок (не путать с таблицей контента)
2. Настройте форму на [sheetmonkey.io](https://sheetmonkey.io) с полями: `Name`, `Email`, `Phone`, `Plan`, `Message`
3. Зарегистрируйте сайт в [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile)
4. Добавьте переменные:

**Локально** — в `.env`:

```env
SHEET_MONKEY_URL=https://api.sheetmonkey.io/form/your-form-id
TURNSTILE_SECRET=your_turnstile_secret
VITE_TURNSTILE_SITE_KEY=your_turnstile_site_key
```

**На Vercel/Netlify** — в Environment Variables (без префикса `VITE_` для секретов):

| Переменная | Где | Описание |
|------------|-----|----------|
| `SHEET_MONKEY_URL` | Server only | URL Sheet Monkey |
| `TURNSTILE_SECRET` | Server only | Secret key Turnstile |
| `VITE_TURNSTILE_SITE_KEY` | Client | Site key Turnstile |

Для локальной разработки без ключей Turnstile используются [тестовые ключи Cloudflare](https://developers.cloudflare.com/turnstile/troubleshooting/testing/).

## Безопасность

| Мера | Реализация |
|------|------------|
| Sheet Monkey URL скрыт | `SHEET_MONKEY_URL` только на сервере, POST через `/api/register` |
| XSS (текст) | React JSX + `sanitizeText()` |
| XSS (URL) | `sanitizeImageUrl()` — только `https://` с whitelist доменов |
| Спам-боты | Honeypot + Cloudflare Turnstile (серверная проверка) |
| Rate limit | 3 заявки / IP / час на serverless |
| CSP | `vercel.json` / `netlify.toml` |
| Разделение таблиц | Контент (публичный Viewer) ≠ заявки (приватная) |

## Обработка ошибок

| Сценарий | Поведение |
|----------|-----------|
| Google Sheet ID не задан | Демо-данные + warning в консоли |
| Ошибка загрузки Sheets | Экран ошибки с кнопкой «Попробовать снова» |
| Битый URL изображения | Блокировка или fallback |
| Валидация формы | Клиент + сервер, подсветка полей |
| Ошибка API | Общее сообщение без утечки деталей |
| Rate limit | «Слишком много заявок» |

## Сборка для продакшена

```bash
npm run build
npm run preview
```

Деплой: **Vercel** (рекомендуется — `api/register.ts`) или **Netlify** (`netlify/functions/register.ts`).

## Технологии

- React 19 + TypeScript + Vite 6 + Tailwind CSS 4
- Google Sheets CSV (публичный контент)
- Vercel/Netlify Serverless + Sheet Monkey
- Cloudflare Turnstile
