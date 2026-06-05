import { ArrowLeft, ArrowRight, Check, CircleAlert, Sparkles } from 'lucide-react'

type Page = 'proposal' | 'competitors' | 'segments'

type InsightPageProps = {
  onNavigate: (page: Page) => void
}

const competitors = [
  {
    name: 'Darlean',
    price: '~$9–18',
    type: 'AI-native digital office',
    ai: 'Да, ядро продукта',
    operations: 'Проекты, no-code автоматизация, документы и e-sign',
    strength: 'AI и консолидация по низкой цене',
    weakness: 'Молодой бренд без узнаваемости в США',
    featured: true,
  },
  {
    name: 'Zoho One',
    price: '$37 / $90',
    type: 'Suite из 45+ приложений',
    ai: 'Zia',
    operations: 'Проекты, автоматизация, документы и e-sign',
    strength: 'Широта и экосистема',
    weakness: 'Сложность, фрагментация, all-employee модель',
  },
  {
    name: 'monday.com',
    price: '$9–19',
    type: 'Work OS',
    ai: 'Базовый AI',
    operations: 'Проекты; автоматизация ограничена тарифами',
    strength: 'Маркетинг, простота и узнаваемость',
    weakness: 'Ghost seats, рост стоимости, слабее AI',
  },
  {
    name: 'ClickUp',
    price: '$7',
    type: 'Work / PM all-in-one',
    ai: 'Платное дополнение',
    operations: 'Проекты, автоматизация, интеграции документов',
    strength: 'Цена и плотность функций',
    weakness: 'Перегруженность и кривая обучения',
  },
  {
    name: 'Odoo',
    price: 'от ~$25 + модули',
    type: 'Open-source ERP',
    ai: 'Ограниченный',
    operations: 'Полный ERP-контур через модули',
    strength: 'Склад, производство и операции',
    weakness: 'Тяжелое внедрение, часто нужен интегратор',
  },
  {
    name: 'Bitrix24',
    price: 'free / от ~$49',
    type: 'CRM + интранет',
    ai: 'Базовый AI',
    operations: 'Проекты, автоматизация, документы и e-sign',
    strength: 'Бесплатный вход и сильное CRM-ядро',
    weakness: 'Громоздкий интерфейс и перегруз функций',
  },
  {
    name: 'DocuSign',
    price: '$25–65',
    type: 'Узкий e-sign инструмент',
    ai: 'Нет',
    operations: 'Только электронная подпись',
    strength: 'Рыночный стандарт e-sign',
    weakness: 'Одна функция, уже встроенная в Darlean',
  },
]

const segments = [
  ['Boutique consulting', '≈120K', 5, '1', 'Встречи, согласования, счета и хаос задач между 10–50 специалистами', 'LinkedIn, Google Search, email nurture'],
  ['Construction / subcontractors', '≈116K', 5, '1', 'Ручные согласования подрядчиков, договоров и смет', 'Google Search, отраслевые сообщества, кейс-видео'],
  ['Logistics / Moving / 3PL', '≈40K', 5, '1', 'Разбор счетов, контроль сроков и операционных отклонений', 'Google Search, LinkedIn, кейсы moving-компаний'],
  ['Professional services', '≈200K', 4, '2', 'Координация команды, документов и дедлайнов', 'Meta, LinkedIn, контент'],
  ['IT / digital agencies', '≈90K', 4, '2', 'PM для не-IT ролей, биллинг и согласования', 'LinkedIn, контент, product-led trial'],
  ['Finance / accounting', '≈80K', 4, '2', 'Согласования, документы, tax season и e-sign', 'Search, LinkedIn, сценарии approvals'],
  ['Healthcare administration', '≈150K', 3, '2', 'Документы и согласования с риском HIPAA', 'Search, коммуникация compliance'],
  ['Real estate', '≈120K', 3, '2', 'Документы, e-sign и координация агентов', 'Meta, Google, сравнение с DocuSign'],
  ['EdTech / courses', '≈50K', 3, '3', 'Координация программ, задач и команды', 'Email, контент'],
  ['Manufacturing SMB', '≈70K', 3, '3', 'Операционные процессы, где часто уже рассматривают ERP', 'Search, осторожно из-за Odoo'],
  ['Retail / e-commerce', '≈250K', 2, '3', 'Нишевые процессы внутри Shopify-стека', 'Meta, точечные сценарии'],
  ['NGO / nonprofits', '≈100K', 2, '3', 'Координация при ограниченном бюджете', 'Низкий приоритет'],
] as const

function PageNav({ onNavigate }: InsightPageProps) {
  return (
    <nav className="nav insight-nav">
      <button className="wordmark" onClick={() => onNavigate('proposal')}>
        Darlean <span>× USA</span>
      </button>
      <div className="nav-links insight-links">
        <button onClick={() => onNavigate('proposal')}>КП и калькулятор</button>
        <button onClick={() => onNavigate('competitors')}>Конкуренты</button>
        <button onClick={() => onNavigate('segments')}>Сегменты</button>
      </div>
    </nav>
  )
}

export function CompetitorsPage({ onNavigate }: InsightPageProps) {
  return (
    <main>
      <PageNav onNavigate={onNavigate} />
      <header className="insight-hero competitor-hero">
        <button className="back-link" onClick={() => onNavigate('proposal')}>
          <ArrowLeft size={17} /> Вернуться к КП
        </button>
        <p className="section-kicker">КОНКУРЕНТНАЯ КАРТА · ИЮНЬ 2026</p>
        <h1>Зона возможности: AI-native продукт без enterprise-цены.</h1>
        <p>
          Darlean занимает редкую позицию между дешевыми task-менеджерами и
          тяжелыми ERP: единый операционный контур с AI, автоматизацией,
          документами и встроенной электронной подписью.
        </p>
      </header>

      <section className="insight-section">
        <div className="opportunity-banner">
          <Sparkles size={24} />
          <div>
            <span>ПОЗИЦИОНИРОВАНИЕ</span>
            <h2>Продавать консолидацию и контроль, а не просто низкую цену.</h2>
          </div>
        </div>
        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Продукт</th>
                <th>Цена / мес.</th>
                <th>AI</th>
                <th>Операционный контур</th>
                <th>Сильная сторона</th>
                <th>Ограничение</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((item) => (
                <tr className={item.featured ? 'featured-row' : ''} key={item.name}>
                  <td><strong>{item.name}</strong><small>{item.type}</small></td>
                  <td>{item.price}</td>
                  <td>{item.ai}</td>
                  <td>{item.operations}</td>
                  <td>{item.strength}</td>
                  <td>{item.weakness}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="source-note">
          Цены указаны на пользователя в месяц для рынка США; Darlean — по
          европейским тарифам Standard €8 / Premium €16.
        </p>
      </section>
      <InsightFooter onNavigate={onNavigate} />
    </main>
  )
}

export function SegmentsPage({ onNavigate }: InsightPageProps) {
  return (
    <main>
      <PageNav onNavigate={onNavigate} />
      <header className="insight-hero segments-hero">
        <button className="back-link" onClick={() => onNavigate('proposal')}>
          <ArrowLeft size={17} /> Вернуться к КП
        </button>
        <p className="section-kicker">СЕГМЕНТАЦИЯ РЫНКА США</p>
        <h1>Начать там, где операционный хаос уже стоит денег.</h1>
        <p>
          Приоритет получают отрасли с командами 10–50 человек, большим
          количеством согласований и документов, но без готовности внедрять
          тяжелую ERP.
        </p>
      </header>

      <section className="insight-section wave-section">
        <div className="section-heading">
          <p className="section-kicker">ПОРЯДОК ТЕСТИРОВАНИЯ</p>
          <h2>Три волны выхода на рынок.</h2>
        </div>
        <div className="wave-grid">
          <article className="wave-card wave-primary">
            <span>ВОЛНА 1 · FIT 5/5</span>
            <h3>Главный тест</h3>
            <p>Boutique consulting, строительство и подрядчики, Logistics / Moving / 3PL.</p>
          </article>
          <article className="wave-card">
            <span>ВОЛНА 2 · FIT 4/5</span>
            <h3>Расширение</h3>
            <p>Finance / accounting, IT-агентства, TikTok-агрегаторы и influencer agencies.</p>
          </article>
          <article className="wave-card">
            <span>ВОЛНА 3 · FIT 3/5</span>
            <h3>После доказательства</h3>
            <p>Healthcare administration и Real estate с отдельными compliance-сценариями.</p>
          </article>
        </div>
      </section>

      <section className="insight-section segment-list-section">
        <div className="section-heading">
          <p className="section-kicker">ИНДУСТРИАЛЬНЫЕ СЕГМЕНТЫ</p>
          <h2>Карта гипотез и каналов.</h2>
        </div>
        <div className="segment-list">
          {segments.map(([name, market, fit, wave, pain, channels]) => (
            <article className="segment-row" key={name}>
              <div className="segment-name">
                <span>ВОЛНА {wave}</span>
                <h3>{name}</h3>
                <small>{market} компаний</small>
              </div>
              <div className="fit-score">
                <strong>{fit}/5</strong>
                <span>Product fit</span>
              </div>
              <div><span>Ключевая боль</span><p>{pain}</p></div>
              <div><span>Каналы теста</span><p>{channels}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="creator-section dark-section">
        <div>
          <p className="section-kicker blue">ФРИЛАНСЕРЫ И КРЕАТОРЫ</p>
          <h2>Не идти широко в solo. Искать управляющих сетями.</h2>
        </div>
        <div className="creator-grid">
          <article><Check size={20} /><h3>TikTok Shop aggregators</h3><p>Десятки тысяч компаний, часто управляют 30+ креаторами. Fit 4/5.</p></article>
          <article><Check size={20} /><h3>Influencer agencies</h3><p>≈15–20K агентств: договоры, согласования, контент и выплаты. Fit 4/5.</p></article>
          <article className="avoid-card"><CircleAlert size={20} /><h3>Solo creators</h3><p>Большой рынок, но низкая готовность платить и Fit 1/5. Не тестировать широко.</p></article>
        </div>
      </section>
      <InsightFooter onNavigate={onNavigate} />
    </main>
  )
}

function InsightFooter({ onNavigate }: InsightPageProps) {
  return (
    <section className="insight-cta">
      <h2>Перевести аналитику в бюджет теста.</h2>
      <button className="button primary" onClick={() => onNavigate('proposal')}>
        Открыть калькулятор <ArrowRight size={18} />
      </button>
    </section>
  )
}
