import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowDown,
  BarChart3,
  Check,
  ChevronRight,
  CircleDollarSign,
  Download,
  Gauge,
  Layers3,
  Menu,
  Sparkles,
  Target,
  X,
} from 'lucide-react'
import { downloadProposal } from './pdf'
import { CompetitorsPage, SegmentsPage } from './InsightPages'

type MediaPreset = 'lean' | 'base' | 'push' | 'custom'
type Page = 'proposal' | 'competitors' | 'segments'

const mediaPresets = {
  lean: {
    label: 'Lean',
    budget: 3000,
    hypotheses: '1–2',
    description: 'Узкая проверка отклика и первые лиды',
  },
  base: {
    label: 'Base',
    budget: 6000,
    hypotheses: '2–3',
    description: 'Статзначимые данные по CPL и индустриям',
  },
  push: {
    label: 'Push',
    budget: 10000,
    hypotheses: '3–4',
    description: 'Быстрее к первым кейсам и масштабированию',
  },
}

const money = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

function App() {
  const getPage = (): Page => {
    const hash = window.location.hash.replace('#', '')
    return hash === 'competitors' || hash === 'segments' ? hash : 'proposal'
  }

  const [page, setPage] = useState<Page>(getPage)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hasContent, setHasContent] = useState(true)
  const [mediaPreset, setMediaPreset] = useState<MediaPreset>('base')
  const [customMedia, setCustomMedia] = useState(6000)
  const [duration, setDuration] = useState(1)
  const [targetCpl, setTargetCpl] = useState(94)
  const [targetCac, setTargetCac] = useState(1000)
  const [leadToSqlRate, setLeadToSqlRate] = useState(21.5)
  const [sqlCloseRate, setSqlCloseRate] = useState(44)
  const [kpiPercent, setKpiPercent] = useState(15)
  const [successFeePercent, setSuccessFeePercent] = useState(10)
  const [averageDealValue, setAverageDealValue] = useState(5000)
  const [clientName, setClientName] = useState('Команда Darlean')
  const [version, setVersion] = useState(1)
  const [generatedAt, setGeneratedAt] = useState(new Date())
  const firstRender = useRef(true)

  const mediaBudget =
    mediaPreset === 'custom' ? customMedia : mediaPresets[mediaPreset].budget
  const mediaLabel =
    mediaPreset === 'custom' ? 'Custom' : mediaPresets[mediaPreset].label
  const hypotheses =
    mediaPreset === 'custom'
      ? customMedia < 4500
        ? '1–2'
        : customMedia < 8000
          ? '2–3'
          : '3–4'
      : mediaPresets[mediaPreset].hypotheses
  const serviceMonthly = 4500 + (hasContent ? 1200 : 0)
  const estimatedLeads = Math.max(0.1, Math.round((mediaBudget / targetCpl) * 10) / 10)
  const estimatedOpportunities = Math.max(
    0.1,
    Math.round((estimatedLeads * (leadToSqlRate / 100)) * 10) / 10,
  )
  const estimatedCustomers = Math.max(
    0.1,
    Math.round((estimatedOpportunities * (sqlCloseRate / 100)) * 10) / 10,
  )
  const calculatedCac = mediaBudget / estimatedCustomers
  const cacDeltaPercent = ((calculatedCac - targetCac) / targetCac) * 100
  const cacOnTarget = calculatedCac <= targetCac
  const kpiBonusMonthly = (mediaBudget * kpiPercent) / 100
  const successFeeMonthly =
    (averageDealValue * estimatedCustomers * successFeePercent) / 100
  const totalMonthly =
    serviceMonthly + mediaBudget + kpiBonusMonthly + successFeeMonthly
  const projectTotal = totalMonthly * duration

  useEffect(() => {
    const handleHashChange = () => {
      setPage(getPage())
      setMenuOpen(false)
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    const timer = window.setTimeout(() => {
      setVersion((current) => current + 1)
      setGeneratedAt(new Date())
    }, 250)
    return () => window.clearTimeout(timer)
  }, [
    hasContent,
    mediaPreset,
    customMedia,
    duration,
    targetCpl,
    targetCac,
    leadToSqlRate,
    sqlCloseRate,
    kpiPercent,
    successFeePercent,
    averageDealValue,
    clientName,
  ])

  const proposalData = useMemo(
    () => ({
      version,
      generatedAt: generatedAt.toLocaleString('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      clientName,
      duration,
      hasContent,
      mediaLabel,
      mediaBudget,
      kpiPercent,
      kpiBonusMonthly,
      successFeePercent,
      averageDealValue,
      closedDeals: estimatedCustomers,
      successFeeMonthly,
      targetCpl,
      targetCac,
      leadToSqlRate,
      sqlCloseRate,
      calculatedCac,
      hypotheses,
      serviceMonthly,
      totalMonthly,
      projectTotal,
      estimatedLeads,
      estimatedOpportunities,
      estimatedCustomers,
    }),
    [
      version,
      generatedAt,
      clientName,
      duration,
      hasContent,
      mediaLabel,
      mediaBudget,
      kpiPercent,
      kpiBonusMonthly,
      successFeePercent,
      averageDealValue,
      successFeeMonthly,
      targetCpl,
      targetCac,
      leadToSqlRate,
      sqlCloseRate,
      calculatedCac,
      hypotheses,
      serviceMonthly,
      totalMonthly,
      projectTotal,
      estimatedLeads,
      estimatedOpportunities,
      estimatedCustomers,
    ],
  )

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const navigate = (nextPage: Page) => {
    window.location.hash = nextPage === 'proposal' ? 'proposal' : nextPage
  }

  if (page === 'competitors') {
    return <CompetitorsPage onNavigate={navigate} />
  }

  if (page === 'segments') {
    return <SegmentsPage onNavigate={navigate} />
  }

  return (
    <main>
      <nav className="nav">
        <button className="wordmark" onClick={() => scrollTo('top')}>
          Darlean <span>× USA</span>
        </button>
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <button onClick={() => scrollTo('approach')}>Подход</button>
          <button onClick={() => navigate('competitors')}>Конкуренты</button>
          <button onClick={() => navigate('segments')}>Сегменты</button>
          <button className="nav-cta" onClick={() => scrollTo('calculator')}>
            Рассчитать
          </button>
        </div>
        <button
          className="menu-button"
          aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <section className="hero" id="top">
        <div className="hero-orb orb-one" />
        <div className="hero-orb orb-two" />
        <div className="eyebrow">КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ · 2026</div>
        <h1>
          Найти ICP.
          <br />
          <span>Прежде чем масштабировать.</span>
        </h1>
        <p className="hero-copy">
          Управляемый запуск Darlean на рынке США: проверяем индустрии,
          офферы и боли на реальных данных, а затем превращаем рабочую
          гипотезу в систему роста.
        </p>
        <div className="hero-actions">
          <button className="button primary" onClick={() => scrollTo('calculator')}>
            Собрать конфигурацию
          </button>
          <button className="text-button" onClick={() => scrollTo('approach')}>
            Как это работает <ChevronRight size={18} />
          </button>
        </div>
        <button
          className="scroll-cue"
          aria-label="Перейти к следующему разделу"
          onClick={() => scrollTo('approach')}
        >
          <ArrowDown size={20} />
        </button>
      </section>

      <section className="statement dark-section" id="approach">
        <p className="section-kicker blue">НАША ЛОГИКА</p>
        <h2>Не покупать трафик вслепую.</h2>
        <p>
          Сначала за небольшие деньги находим индустрию, боль и
          killer-feature, которые действительно откликаются американскому SMB.
          И только потом разворачиваем рекламу как постоянное направление.
        </p>
        <div className="stage-grid">
          <article>
            <span>01</span>
            <div>
              <h3>Тест гипотез</h3>
              <p>4–6 недель · контролируемый бюджет · решение на данных</p>
            </div>
          </article>
          <article>
            <span>02</span>
            <div>
              <h3>Системный рост</h3>
              <p>Подтвержденный ICP · прогнозируемая воронка · масштабирование</p>
            </div>
          </article>
        </div>
      </section>

      <section className="scope-section" id="scope">
        <div className="section-heading">
          <p className="section-kicker">ЧТО МЫ ЗАПУСКАЕМ</p>
          <h2>Одна команда. Вся система теста.</h2>
          <p>
            Стратегия, трафик, посадочные, email и аналитика работают как
            единый контур — без потерь на передаче между подрядчиками.
          </p>
        </div>
        <div className="scope-grid">
          <article className="scope-card feature-card">
            <div className="icon-chip">
              <Target size={24} />
            </div>
            <p className="card-label">СТРАТЕГИЯ</p>
            <h3>Карта гипотез</h3>
            <p>Индустрии × боли × офферы. Каждая связка получает свой тест.</p>
            <div className="hypothesis-map" aria-hidden="true">
              <span>ICP</span>
              <i />
              <span>Pain</span>
              <i />
              <span>Offer</span>
            </div>
          </article>
          <article className="scope-card">
            <div className="icon-chip">
              <Gauge size={24} />
            </div>
            <p className="card-label">PERFORMANCE</p>
            <h3>Meta + Google</h3>
            <p>
              Сегментация в Meta, горячий intent в Search, A/B-тесты и
              оптимизация под quality lead.
            </p>
          </article>
          <article className="scope-card">
            <div className="icon-chip">
              <Layers3 size={24} />
            </div>
            <p className="card-label">КОНВЕРСИЯ</p>
            <h3>Landing + Email</h3>
            <p>
              Lead forms, посадочные и nurture-цепочки для sales-driven и
              self-service воронок.
            </p>
          </article>
          <article className="scope-card dark-card">
            <div className="icon-chip">
              <BarChart3 size={24} />
            </div>
            <p className="card-label">АНАЛИТИКА</p>
            <h3>Не CPL любой ценой.</h3>
            <p>
              Смотрим глубже: конверсии, cost-per-opportunity и качество
              отклика по каждой индустрии.
            </p>
            <div className="metric-row">
              <span>CPL</span>
              <span>CVR</span>
              <span>CPO</span>
            </div>
          </article>
        </div>
      </section>

      <section className="content-banner">
        <div>
          <p className="section-kicker blue">ОПЦИЯ · СЛОЙ ДОВЕРИЯ</p>
          <h2>Реклама приводит. Контент убеждает.</h2>
          <p>
            8–12 нативных материалов в месяц: LinkedIn, продуктовые демо,
            живые кейсы и AI-аватары для быстрого продакшена.
          </p>
        </div>
        <div className="content-stat">
          <Sparkles size={27} />
          <strong>+$1,200</strong>
          <span>в месяц</span>
        </div>
      </section>

      <section className="calculator-section" id="calculator">
        <div className="section-heading centered">
          <p className="section-kicker">КАЛЬКУЛЯТОР КП</p>
          <h2>Соберите сценарий запуска.</h2>
          <p>
            Каждый параметр обновляет расчет и создает новую версию
            коммерческого предложения.
          </p>
        </div>

        <div className="calculator-shell">
          <div className="controls">
            <div className="control-group">
              <label htmlFor="clientName">Получатель КП</label>
              <input
                id="clientName"
                className="text-input"
                value={clientName}
                onChange={(event) => setClientName(event.target.value)}
                placeholder="Название компании или команды"
              />
            </div>

            <div className="control-group">
              <div className="label-row">
                <label>Работа команды</label>
                <span>{money(serviceMonthly)} / мес.</span>
              </div>
              <button
                className={`option-card selected`}
                aria-pressed="true"
                type="button"
              >
                <span className="option-check">
                  <Check size={15} />
                </span>
                <span>
                  <strong>Performance</strong>
                  <small>Meta + Google + Email · обязательный блок</small>
                </span>
                <b>$4,500</b>
              </button>
              <button
                className={`option-card ${hasContent ? 'selected' : ''}`}
                aria-pressed={hasContent}
                onClick={() => setHasContent((value) => !value)}
                type="button"
              >
                <span className="option-check">
                  {hasContent && <Check size={15} />}
                </span>
                <span>
                  <strong>Контент в соцсетях</strong>
                  <small>8–12 единиц · LinkedIn + ICP-платформа</small>
                </span>
                <b>+$1,200</b>
              </button>
            </div>

            <div className="control-group">
              <div className="label-row">
                <label>Медиасценарий</label>
                <span>{money(mediaBudget)} / мес.</span>
              </div>
              <div className="preset-grid">
                {(Object.keys(mediaPresets) as Array<keyof typeof mediaPresets>).map(
                  (key) => {
                    const preset = mediaPresets[key]
                    return (
                      <button
                        key={key}
                        className={`preset ${mediaPreset === key ? 'active' : ''}`}
                        onClick={() => setMediaPreset(key)}
                        type="button"
                      >
                        <span>{preset.label}</span>
                        <strong>{money(preset.budget)}</strong>
                        <small>{preset.hypotheses} гипотезы</small>
                      </button>
                    )
                  },
                )}
              </div>
              <button
                className={`custom-toggle ${mediaPreset === 'custom' ? 'active' : ''}`}
                onClick={() => setMediaPreset('custom')}
                type="button"
              >
                Свой бюджет
              </button>
              {mediaPreset === 'custom' && (
                <div className="range-wrap">
                  <input
                    aria-label="Свой медиабюджет"
                    type="range"
                    min="2000"
                    max="15000"
                    step="500"
                    value={customMedia}
                    onChange={(event) => setCustomMedia(Number(event.target.value))}
                  />
                  <div className="range-scale">
                    <span>$2K</span>
                    <strong>{money(customMedia)}</strong>
                    <span>$15K</span>
                  </div>
                </div>
              )}
              <p className="control-hint">
                {mediaPreset === 'custom'
                  ? `${hypotheses} гипотезы в параллельном тесте`
                  : mediaPresets[mediaPreset].description}
              </p>
              {mediaPreset === 'base' && (
                <div className="media-breakdown">
                  {[
                    ['Meta', 3500],
                    ['Search', 1200],
                    ['КМС', 600],
                    ['YouTube', 700],
                  ].map(([channel, budget]) => (
                    <div key={channel}>
                      <span>{channel}</span>
                      <strong>{money(Number(budget))}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="split-controls">
              <div className="control-group">
                <label htmlFor="duration">Период</label>
                <select
                  id="duration"
                  value={duration}
                  onChange={(event) => setDuration(Number(event.target.value))}
                >
                  <option value={1}>1 месяц</option>
                  <option value={2}>2 месяца</option>
                  <option value={3}>3 месяца</option>
                </select>
              </div>
              <div className="control-group">
                <label htmlFor="kpiPercent">KPI-бонус от media / мес.</label>
                <div className="money-input percent-input">
                  <input
                    id="kpiPercent"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={kpiPercent}
                    onChange={(event) =>
                      setKpiPercent(
                        Math.min(100, Math.max(0, Number(event.target.value))),
                      )
                    }
                  />
                  <span>%</span>
                </div>
                <small className="control-hint">
                  {money(kpiBonusMonthly)} при текущем медиабюджете
                </small>
              </div>
            </div>

            <div className="performance-fee">
              <div className="fee-heading">
                <div>
                  <span>ОПЛАТА ЗА РЕЗУЛЬТАТ</span>
                  <h3>{successFeePercent}% от стоимости закрытых сделок</h3>
                </div>
                <div className="money-input percent-input compact-input">
                  <input
                    aria-label="Процент оплаты за результат"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={successFeePercent}
                    onChange={(event) =>
                      setSuccessFeePercent(
                        Math.min(100, Math.max(0, Number(event.target.value))),
                      )
                    }
                  />
                  <span>%</span>
                </div>
              </div>
              <div className="split-controls">
                <div className="control-group">
                  <label htmlFor="averageDealValue">Средняя стоимость сделки</label>
                  <div className="money-input">
                    <span>$</span>
                    <input
                      id="averageDealValue"
                      type="number"
                      min="0"
                      step="500"
                      value={averageDealValue}
                      onChange={(event) =>
                        setAverageDealValue(
                          Math.max(0, Number(event.target.value)),
                        )
                      }
                    />
                  </div>
                </div>
                <div className="control-group">
                  <label>Прогноз сделок / мес.</label>
                  <div className="calculated-value">
                    <strong>~{estimatedCustomers}</strong>
                    <span>media ÷ CAC</span>
                  </div>
                </div>
              </div>
              <p className="fee-total">
                Прогнозная оплата за результат: <strong>{money(successFeeMonthly)} / мес.</strong>
              </p>
            </div>

            <div className="control-group">
              <div className="label-row">
                <label htmlFor="targetCpl">Целевой CPL</label>
                <span>{money(targetCpl)}</span>
              </div>
              <input
                id="targetCpl"
                type="range"
                min="70"
                max="300"
                step="1"
                value={targetCpl}
                onChange={(event) => setTargetCpl(Number(event.target.value))}
              />
              <div className="range-scale">
                <span>$70</span>
                <span>$300</span>
              </div>
            </div>

            <div className="control-group">
              <div className="label-row">
                <label htmlFor="targetCac">Целевой CAC</label>
                <span>{money(targetCac)}</span>
              </div>
              <input
                id="targetCac"
                type="range"
                min="500"
                max="2500"
                step="100"
                value={targetCac}
                onChange={(event) => setTargetCac(Number(event.target.value))}
              />
              <div className="range-scale">
                <span>$500</span>
                <span>$2,500</span>
              </div>
              <small className="control-hint">
                Контрольный KPI. Расчетный CAC по воронке:{' '}
                <strong className={cacOnTarget ? 'metric-good' : 'metric-warning'}>
                  {money(calculatedCac)}
                </strong>
                {' '}({cacOnTarget ? 'в пределах цели' : `выше цели на ${Math.round(cacDeltaPercent)}%`})
              </small>
            </div>

            <div className="control-group">
              <div className="label-row">
                <label htmlFor="leadToSqlRate">Конверсия Lead → SQL</label>
                <span>{leadToSqlRate}%</span>
              </div>
              <input
                id="leadToSqlRate"
                type="range"
                min="5"
                max="60"
                step="0.5"
                value={leadToSqlRate}
                onChange={(event) =>
                  setLeadToSqlRate(Number(event.target.value))
                }
              />
              <div className="range-scale">
                <span>5%</span>
                <span>60%</span>
              </div>
            </div>

            <div className="control-group">
              <div className="label-row">
                <label htmlFor="sqlCloseRate">Конверсия SQL → сделка</label>
                <span>{sqlCloseRate}%</span>
              </div>
              <input
                id="sqlCloseRate"
                type="range"
                min="10"
                max="80"
                step="1"
                value={sqlCloseRate}
                onChange={(event) =>
                  setSqlCloseRate(Number(event.target.value))
                }
              />
              <div className="range-scale">
                <span>10%</span>
                <span>80%</span>
              </div>
            </div>

            <div className="funnel-formula">
              <div>
                <span>MEDIA</span>
                <strong>{money(mediaBudget)}</strong>
              </div>
              <i>÷ CPL</i>
              <div>
                <span>ЛИДЫ</span>
                <strong>~{estimatedLeads}</strong>
              </div>
              <i>× {leadToSqlRate}%</i>
              <div>
                <span>SQL</span>
                <strong>~{estimatedOpportunities}</strong>
              </div>
              <i>× {sqlCloseRate}%</i>
              <div>
                <span>СДЕЛКИ</span>
                <strong>~{estimatedCustomers}</strong>
              </div>
              <i>→</i>
              <div>
                <span>РАСЧЕТНЫЙ CAC</span>
                <strong>{money(calculatedCac)}</strong>
              </div>
            </div>
          </div>

          <aside className="summary">
            <div className="summary-topline">
              <span>КП · версия {version}</span>
              <i>Обновлено</i>
            </div>
            <p className="summary-caption">Бюджет проекта</p>
            <h3>{money(projectTotal)}</h3>
            <p className="summary-period">
              {money(totalMonthly)} / месяц · {duration}{' '}
              {duration === 1 ? 'месяц' : 'месяца'}
            </p>

            <div className="summary-lines">
              <div>
                <span>Performance</span>
                <strong>{money(4500 * duration)}</strong>
              </div>
              {hasContent && (
                <div>
                  <span>Контент</span>
                  <strong>{money(1200 * duration)}</strong>
                </div>
              )}
              <div>
                <span>Media · {mediaLabel}</span>
                <strong>{money(mediaBudget * duration)}</strong>
              </div>
              {kpiBonusMonthly > 0 && (
                <div>
                  <span>KPI-бонус · {kpiPercent}%</span>
                  <strong>{money(kpiBonusMonthly * duration)}</strong>
                </div>
              )}
              {successFeeMonthly > 0 && (
                <div>
                  <span>За результат · {successFeePercent}%</span>
                  <strong>{money(successFeeMonthly * duration)}</strong>
                </div>
              )}
            </div>

            <div className="forecast">
              <p>Ориентир теста / месяц</p>
              <div>
                <span>
                  <strong>{hypotheses}</strong>
                  гипотезы
                </span>
                <span>
                  <strong>~{estimatedLeads}</strong>
                  лидов
                </span>
                <span>
                  <strong>~{estimatedOpportunities}</strong>
                  SQL
                </span>
                <span>
                  <strong>~{estimatedCustomers}</strong>
                  сделок
                </span>
              </div>
            </div>

            <button
              className="button download-button"
              onClick={() => void downloadProposal(proposalData)}
            >
              <Download size={18} />
              Скачать КП · PDF
            </button>
            <p className="legal-note">
              Прогнозные показатели — ориентир для планирования теста и не
              являются гарантией результата.
            </p>
          </aside>
        </div>
      </section>

      <section className="comparison-section" id="comparison">
        <div className="section-heading">
          <p className="section-kicker">КОНКУРЕНТНЫЙ КОНТЕКСТ · ИЮНЬ 2026</p>
          <h2>AI и консолидация — без enterprise-цены.</h2>
          <p>
            Darlean объединяет проекты, автоматизацию, документы и e-sign.
            Конкуренты либо закрывают только часть контура, либо заметно
            дорожают вместе с шириной функций.
          </p>
        </div>
        <div className="competitor-grid">
          {[
            {
              name: 'Darlean',
              price: '~$9–18',
              type: 'AI-native digital office',
              strength: 'AI + консолидация + e-sign',
              featured: true,
            },
            {
              name: 'Zoho One',
              price: '$37 / $90',
              type: 'Suite из 45+ приложений',
              strength: 'Широко, но сложно и фрагментарно',
            },
            {
              name: 'monday.com',
              price: '$9–19',
              type: 'Work OS',
              strength: 'Узнаваемость, базовый AI',
            },
            {
              name: 'ClickUp',
              price: '$7',
              type: 'Work / PM all-in-one',
              strength: 'Плотность функций, сложный UX',
            },
            {
              name: 'Odoo',
              price: 'от ~$25',
              type: 'Open-source ERP',
              strength: 'Модули и внедрение удорожают',
            },
            {
              name: 'Bitrix24',
              price: 'от ~$49 / аккаунт',
              type: 'CRM + интранет',
              strength: 'Громоздкий интерфейс',
            },
            {
              name: 'DocuSign',
              price: '$25–65',
              type: 'Только e-sign',
              strength: 'Одна функция, встроенная в Darlean',
            },
          ].map((competitor) => (
            <article
              className={`competitor-card ${competitor.featured ? 'featured' : ''}`}
              key={competitor.name}
            >
              {competitor.featured && (
                <span className="opportunity">ЗОНА ВОЗМОЖНОСТИ</span>
              )}
              <div className="competitor-top">
                <h3>{competitor.name}</h3>
                <strong>{competitor.price}</strong>
              </div>
              <p>{competitor.type}</p>
              <small>{competitor.strength}</small>
            </article>
          ))}
        </div>
        <p className="price-note">
          Цены за пользователя в месяц для рынка США; Darlean — по EU-версии.
          Источник: предоставленная сравнительная карта.
        </p>
        <button
          className="button secondary-button"
          onClick={() => navigate('competitors')}
        >
          Открыть полное сравнение
          <ChevronRight size={18} />
        </button>
      </section>

      <section className="outcomes dark-section">
        <p className="section-kicker blue">НА ВЫХОДЕ ЭТАПА 1</p>
        <h2>Не отчет о кликах. Решение, куда расти.</h2>
        <div className="outcome-grid">
          {[
            ['01', 'Подтвержденный ICP', 'Индустрия и сегмент, где продукт получает живой отклик.'],
            ['02', 'Рабочее сообщение', 'Боль, оффер и killer-feature для американского SMB.'],
            ['03', 'Экономика канала', 'CPL, конверсии, CPO и ориентир по CAC.'],
            ['04', 'План масштаба', 'Рекомендация по бюджету, каналам и этапу 2.'],
          ].map(([number, title, copy]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <CircleDollarSign size={34} />
        <h2>Готовы начать с данных.</h2>
        <p>
          Рекомендуемая конфигурация: Performance + Контент и Base media.
          Первые гипотезы — в течение недели после стартового созвона.
        </p>
        <button className="button primary" onClick={() => scrollTo('calculator')}>
          Пересчитать предложение
        </button>
      </section>

      <footer>
        <span>Darlean × USA</span>
        <span>Коммерческое предложение · 2026</span>
      </footer>
    </main>
  )
}

export default App
