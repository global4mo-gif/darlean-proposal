import type { Content, TDocumentDefinitions } from 'pdfmake/interfaces'

export type ProposalData = {
  version: number
  generatedAt: string
  clientName: string
  duration: number
  hasContent: boolean
  mediaLabel: string
  mediaBudget: number
  kpiPercent: number
  kpiBonusMonthly: number
  successFeePercent: number
  averageDealValue: number
  closedDeals: number
  successFeeMonthly: number
  targetCpl: number
  targetCac: number
  sqlCloseRate: number
  hypotheses: string
  serviceMonthly: number
  totalMonthly: number
  projectTotal: number
  estimatedLeads: number
  estimatedOpportunities: number
  estimatedCustomers: number
}

const money = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

export async function downloadProposal(data: ProposalData) {
  const [{ default: pdfMake }, { default: pdfFonts }] = await Promise.all([
    import('pdfmake/build/pdfmake'),
    import('pdfmake/build/vfs_fonts'),
  ])
  pdfMake.vfs = pdfFonts as unknown as Record<string, string>

  const baseMediaPlan = [
    ['Meta (Facebook + Instagram)', '$3 500', '$90', '39', '9,7'],
    ['Google Search', '$1 200', '$180', '7', '2,7'],
    ['Google КМС', '$600', '$70', '9', '0,7'],
    ['YouTube pre-roll', '$700', '$70', '10', '0,6'],
  ]
  const mediaSection: Content[] =
    data.mediaLabel === 'Base'
      ? [
          { text: 'Медиаплан Base · месяц', style: 'h2' },
          {
            table: {
              headerRows: 1,
              widths: ['*', 'auto', 'auto', 'auto', 'auto'],
              body: [
                ['Канал', 'Бюджет', 'CPL', 'Лиды', 'SQL'],
                ...baseMediaPlan,
                [
                  { text: 'ИТОГО', bold: true },
                  { text: '$6 000', bold: true },
                  '',
                  { text: '64', bold: true },
                  { text: '13,7', bold: true },
                ],
              ],
            },
            layout: 'lightHorizontalLines',
          },
          {
            text: 'Проекция на 6 недель: $9 000 media, ~96 лидов и ~20,5 opportunities.',
            style: 'muted',
            margin: [0, 7, 0, 0],
          },
        ]
      : []

  const doc: TDocumentDefinitions = {
    pageSize: 'A4',
    pageMargins: [46, 44, 46, 52],
    defaultStyle: {
      font: 'Roboto',
      fontSize: 10,
      color: '#1d1d1f',
      lineHeight: 1.35,
    },
    footer: (currentPage, pageCount) => ({
      margin: [46, 8, 46, 0],
      columns: [
        { text: `Darlean · КП v${data.version}`, color: '#7a7a7a', fontSize: 8 },
        {
          text: `${currentPage} / ${pageCount}`,
          color: '#7a7a7a',
          fontSize: 8,
          alignment: 'right',
        },
      ],
    }),
    styles: {
      eyebrow: { color: '#0066cc', fontSize: 9, bold: true, characterSpacing: 1.2 },
      title: { fontSize: 29, bold: true, lineHeight: 1.05, margin: [0, 12, 0, 10] },
      lead: { fontSize: 14, color: '#55555a', lineHeight: 1.35, margin: [0, 0, 0, 22] },
      h2: { fontSize: 18, bold: true, margin: [0, 23, 0, 10] },
      muted: { color: '#6e6e73', fontSize: 9 },
      metric: { fontSize: 20, bold: true, color: '#0066cc' },
    },
    content: [
      { text: `КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ · ВЕРСИЯ ${data.version}`, style: 'eyebrow' },
      { text: 'Запуск Darlean на рынке США', style: 'title' },
      {
        text: 'Тестирование гипотез, поиск ICP и подготовка масштабируемой performance-системы.',
        style: 'lead',
      },
      {
        table: {
          widths: ['*', '*', '*'],
          body: [
            [
              { text: 'ПОДГОТОВЛЕНО ДЛЯ', style: 'muted' },
              { text: 'ДАТА РАСЧЕТА', style: 'muted' },
              { text: 'ПЕРИОД', style: 'muted' },
            ],
            [
              { text: data.clientName || 'Команда Darlean', bold: true },
              { text: data.generatedAt, bold: true },
              { text: `${data.duration} мес.`, bold: true },
            ],
          ],
        },
        layout: 'lightHorizontalLines',
      },
      { text: 'Конфигурация', style: 'h2' },
      {
        columns: [
          {
            stack: [
              { text: 'Работа / месяц', style: 'muted' },
              { text: money(data.serviceMonthly), style: 'metric' },
            ],
          },
          {
            stack: [
              { text: 'Media / месяц', style: 'muted' },
              { text: money(data.mediaBudget), style: 'metric' },
            ],
          },
          {
            stack: [
              { text: 'Итого за проект', style: 'muted' },
              { text: money(data.projectTotal), style: 'metric' },
            ],
          },
        ],
        columnGap: 16,
      },
      {
        margin: [0, 15, 0, 0],
        table: {
          widths: ['*', 'auto'],
          body: [
            ['Performance: Meta + Google + Email', money(4500 * data.duration)],
            ...(data.hasContent
              ? [['Контент в соцсетях', money(1200 * data.duration)]]
              : []),
            [`Media: ${data.mediaLabel}`, money(data.mediaBudget * data.duration)],
            ...(data.kpiBonusMonthly > 0
              ? [[
                  `KPI-бонус · ${data.kpiPercent}% от media`,
                  money(data.kpiBonusMonthly * data.duration),
                ]]
              : []),
            ...(data.successFeeMonthly > 0
              ? [[
                  `Оплата за результат · ${data.successFeePercent}%`,
                  money(data.successFeeMonthly * data.duration),
                ]]
              : []),
            [
              { text: `Итого · ${data.duration} мес.`, bold: true },
              { text: money(data.projectTotal), bold: true, color: '#0066cc' },
            ],
          ],
        },
        layout: 'lightHorizontalLines',
      },
      { text: 'Что входит', style: 'h2' },
      {
        ul: [
          'Стратегия и карта гипотез: индустрии × боли × офферы.',
          'Meta, Google Search, A/B-тесты аудиторий и офферов.',
          'Посадочные страницы и lead forms под каждую гипотезу.',
          'Welcome- и nurture-цепочки для sales-driven и self-service воронок.',
          'Сквозная аналитика: CPL, конверсия и cost-per-opportunity.',
          ...(data.hasContent
            ? [
                'Контент-стратегия и ведение выбранной ICP-платформы.',
                '8–12 нативных роликов, демонстраций и постов в месяц.',
                'AI-аватары для быстрого производства контента.',
              ]
            : []),
        ],
      },
      { text: 'Прогноз теста', style: 'h2' },
      {
        table: {
          widths: ['*', '*', '*', '*'],
          body: [
            ['Гипотезы', 'Лиды', 'SQL / opp.', 'Платящие клиенты'],
            [
              { text: data.hypotheses, bold: true },
              { text: `~${data.estimatedLeads}`, bold: true },
              { text: `~${data.estimatedOpportunities}`, bold: true },
              { text: `~${data.estimatedCustomers}`, bold: true },
            ],
          ],
        },
        layout: 'lightHorizontalLines',
      },
      {
        text: `Связанная модель: ${money(data.mediaBudget)} media ÷ CPL ${money(data.targetCpl)} = ~${data.estimatedLeads} лидов; ${money(data.mediaBudget)} ÷ CAC ${money(data.targetCac)} = ~${data.estimatedCustomers} сделок; при конверсии SQL → сделка ${data.sqlCloseRate}% требуется ~${data.estimatedOpportunities} SQL. Прогноз — ориентир, а не гарантия результата.`,
        style: 'muted',
        margin: [0, 7, 0, 0],
      },
      {
        text: `Переменная часть: KPI-бонус ${data.kpiPercent}% от медиабюджета (${money(data.kpiBonusMonthly)} / мес.) и ${data.successFeePercent}% от стоимости закрытых сделок. В прогнозе: ${data.closedDeals} сделок по ${money(data.averageDealValue)}, оплата за результат ${money(data.successFeeMonthly)} / мес.`,
        style: 'muted',
        margin: [0, 7, 0, 0],
      },
      ...mediaSection,
      { text: 'Результат этапа 1', style: 'h2' },
      {
        ul: [
          'Карта протестированных индустрий, офферов и сообщений.',
          'Подтвержденный или скорректированный ICP для США.',
          'Первые квалифицированные лиды и потенциальные клиенты-кейсы.',
          'Экономика канала: CPL, конверсии, CAC и cost-per-opportunity.',
          'Рекомендация по системному масштабированию на этапе 2.',
        ],
      },
      { text: 'Конкурентный контекст продукта', style: 'h2' },
      {
        table: {
          headerRows: 1,
          widths: ['*', 'auto', '*'],
          body: [
            ['Продукт', 'Цена / польз. / мес.', 'Позиция'],
            ['Darlean', '~$9–18', 'AI-native office, автоматизация, документы и e-sign'],
            ['Zoho One', '$37 / $90', 'Широкая suite, но сложная и фрагментарная'],
            ['monday.com', '$9–19', 'Work OS, базовый AI'],
            ['ClickUp', '$7', 'Плотность функций, перегруженный UX'],
            ['Odoo', 'от ~$25 + модули', 'ERP, часто нужен интегратор'],
            ['Bitrix24', 'free / от ~$49 за аккаунт', 'CRM + интранет'],
            ['DocuSign', '$25–65', 'Только e-sign; в Darlean подпись уже внутри'],
          ],
        },
        layout: 'lightHorizontalLines',
      },
      {
        text: 'Позиционирование: продавать не дешевизну, а консолидацию и контроль — весь операционный контур в одном месте под управлением AI.',
        style: 'muted',
        margin: [0, 7, 0, 0],
      },
      { text: 'Следующий шаг', style: 'h2' },
      {
        text: `Согласовать конфигурацию «${data.hasContent ? 'Performance + Контент' : 'Performance'}» и media «${data.mediaLabel}». После стартового созвона первые гипотезы запускаются в течение недели.`,
        fontSize: 13,
        bold: true,
      },
    ],
  }

  const safeDate = new Date().toISOString().slice(0, 10)
  pdfMake.createPdf(doc).download(`Darlean-KP-v${data.version}-${safeDate}.pdf`)
}
