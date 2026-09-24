import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Building2, Check, ChevronDown, Clock3, Compass, GraduationCap, HeartHandshake, Layers3, Mail, MapPin, Megaphone, Network, Pause, Play, Target } from 'lucide-react'
import { content } from './content'
import { contactHref, routes } from './navigation'
import type { Language, PageId, PageIntro } from './types'
import { ui } from './ui'

const heroScenes = ['architecture', 'collaboration', 'infrastructure'] as const
const number = (value: number) => String(value).padStart(2, '0')

function PageHeading({ intro, index }: { intro: PageIntro; index: number }) {
  return (
    <header className="page-hero">
      <div className="container">
        <div className="mb-8 flex items-center justify-between gap-6">
          <p className="eyebrow !mb-0">{intro.eyebrow}</p>
          <span className="page-number" aria-hidden="true">{number(index)} / 07</span>
        </div>
        <h1 className="page-title animate-blur-fade-up">{intro.title}</h1>
        <p className="page-description animate-blur-fade-up" style={{ animationDelay: '100ms' }}>{intro.description}</p>
      </div>
    </header>
  )
}

function ClosingCTA({ language }: { language: Language }) {
  const copy = content[language]
  const labels = ui[language]
  return (
    <section className="cta-band">
      <div className="container">
        <div className="section-heading !mb-0 reveal">
          <div className="max-w-3xl">
            <p className="eyebrow">{labels.getInTouch}</p>
            <h2 className="section-title">{copy.home.closingTitle}</h2>
            <p className="body-copy mt-6 max-w-2xl">{copy.home.closingBody}</p>
          </div>
          <Link className="btn btn-primary" to={routes[language].contact}>
            {labels.contact}<ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}

function Hero({ language }: { language: Language }) {
  const copy = content[language]
  const labels = ui[language]
  const [active, setActive] = useState(0)
  const [autoplay, setAutoplay] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [visible, setVisible] = useState(() => !document.hidden)
  const [inView, setInView] = useState(true)
  const heroRef = useRef<HTMLElement>(null)
  const rotationRef = useRef<HTMLButtonElement>(null)
  const changeScene = (direction: number) => setActive((current) => (current + direction + heroScenes.length) % heroScenes.length)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMotionChange = () => { if (media.matches) setAutoplay(false) }
    const onVisibilityChange = () => setVisible(!document.hidden)
    media.addEventListener('change', onMotionChange)
    document.addEventListener('visibilitychange', onVisibilityChange)
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 })
    if (heroRef.current) observer.observe(heroRef.current)
    return () => {
      media.removeEventListener('change', onMotionChange)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!autoplay || !visible || !inView) return
    // Restart the delay after every slide, including a manual arrow click.
    const timer = window.setTimeout(() => setActive(current => (current + 1) % heroScenes.length), 6000)
    return () => window.clearTimeout(timer)
  }, [active, autoplay, visible, inView])

  return (
    <section ref={heroRef} className="home-hero" data-scene={heroScenes[active]} aria-labelledby="home-title" onFocusCapture={event => {
      if (event.target !== rotationRef.current && event.target.matches(':focus-visible')) setAutoplay(false)
    }}>
      {heroScenes.map((scene, index) => (
        <img
          key={scene}
          className={`hero-image${index === active ? ' is-active' : ''}`}
          src={`/images/${scene === 'collaboration' ? 'hero-collaboration' : scene}.jpg`}
          alt={index === active ? copy.hero.slides[index].alt : ''}
          aria-hidden={index !== active}
          fetchPriority={index === 0 ? 'high' : 'auto'}
          decoding="async"
        />
      ))}
      <div className="hero-bottom-blur" aria-hidden="true" />
      <div className="container home-hero-content">
        <div className="hero-meta animate-blur-fade-up" style={{ animationDelay: '100ms' }}>
          <span><MapPin size={13} aria-hidden="true" />{copy.location}</span>
          <span><i className="dot" aria-hidden="true" />{copy.hero.eyebrow}</span>
        </div>
        <h1 id="home-title" className="home-hero-title animate-blur-fade-up" style={{ animationDelay: '200ms' }}>{copy.hero.title}</h1>
        <p className="home-hero-description animate-blur-fade-up" style={{ animationDelay: '300ms' }}>{copy.hero.description}</p>
        <div className="hero-lower animate-blur-fade-up" style={{ animationDelay: '400ms' }}>
          <div className="hero-cta-row">
            <Link className="btn btn-primary" to={routes[language].services}>
              {labels.discoverServices}<ArrowUpRight size={17} aria-hidden="true" />
            </Link>
            <a className="btn btn-glass liquid-glass" href={contactHref(language, 'consultation')}>
              {labels.consultation}<ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="flex flex-col items-end gap-4">
            <p className="text-[10px] tracking-[.1em] uppercase" aria-live={autoplay ? 'off' : 'polite'} aria-atomic="true">
              <span className="sr-only">{labels.scene} {active + 1} {labels.of} {heroScenes.length} : </span>
              {copy.hero.slides[active].label}
            </p>
            <div className="hero-carousel">
              <button ref={rotationRef} className="liquid-glass" type="button" aria-label={autoplay ? labels.pauseSlideshow : labels.playSlideshow} title={autoplay ? labels.pauseSlideshow : labels.playSlideshow} onClick={() => setAutoplay(current => !current)}>{autoplay ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}</button>
              <button className="liquid-glass" type="button" aria-label={labels.previous} onClick={() => changeScene(-1)}><ArrowLeft size={19} aria-hidden="true" /></button>
              <span aria-hidden="true">{number(active + 1)} <span className="opacity-50">/ {number(heroScenes.length)}</span></span>
              <button className="liquid-glass" type="button" aria-label={labels.next} onClick={() => changeScene(1)}><ArrowRight size={19} aria-hidden="true" /></button>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-x-6">
          <a className="hero-scroll" href="#vision">{labels.scroll}<ArrowDown size={15} aria-hidden="true" /></a>
          <Link className="hero-scroll" to={routes[language].contact}>{labels.contact}<ArrowUpRight size={15} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  )
}

function Home({ language }: { language: Language }) {
  const copy = content[language]
  const labels = ui[language]
  const whyIcons = [Compass, Target, Layers3, MapPin]
  return (
    <>
      <Hero language={language} />
      <section id="vision" className="section-pad">
        <div className="container intro-grid reveal">
          <p className="eyebrow">{copy.home.introLabel}</p>
          <div>
            <h2 className="section-title">{copy.home.introTitle}</h2>
            <p className="lead-copy mt-8">{copy.home.introBody}</p>
            <div className="mt-8 max-w-3xl">
              {copy.home.context.map((paragraph) => <p className="body-copy" key={paragraph}>{paragraph}</p>)}
            </div>
            <Link className="btn-link mt-5" to={routes[language].about}>{labels.about}<ArrowUpRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
      <section className="section-pad bg-navy">
        <div className="container">
          <div className="section-heading reveal">
            <div><p className="eyebrow">{labels.expertise}</p><h2 className="section-title max-w-2xl">{labels.expertiseIntro}</h2></div>
            <Link className="btn-link" to={routes[language].services}>{labels.allServices}<ArrowUpRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className="services-list">
            {copy.services.map((service, index) => (
              <Link className="service-row reveal" key={service.id} to={`${routes[language].services}#${service.id}`}>
                <span className="service-number">{number(index + 1)}</span>
                <div><h3 className="service-row-title">{service.title}</h3><p className="service-row-description">{service.body}</p></div>
                <ArrowUpRight size={24} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section-pad">
        <div className="container editorial-grid">
          <figure className="reveal">
            <img className="editorial-photo" src="/images/team.jpg" alt={labels.imageAlt.team} width="1200" height="799" loading="lazy" />
            <figcaption className="muted mt-3 text-[10px] tracking-wider">{labels.teamImageLabel}</figcaption>
          </figure>
          <div>
            <p className="eyebrow">{labels.difference}</p>
            <h2 className="section-title mb-10">{copy.home.whyTitle}</h2>
            <div className="why-grid">
              {copy.home.why.map((item, index) => {
                const Icon = whyIcons[index]
                return <article className="why-card reveal" key={item.title}><Icon size={22} strokeWidth={1.4} aria-hidden="true" /><h3>{item.title}</h3><p>{item.body}</p></article>
              })}
            </div>
          </div>
        </div>
      </section>
      <section className="section-pad border-t border-white/10">
        <div className="container">
          <div className="section-heading reveal"><div><p className="eyebrow">{labels.outcomes}</p><h2 className="section-title">{copy.home.benefitsTitle}</h2></div></div>
          <div className="benefits-grid">
            {copy.home.benefits.map((benefit, index) => <article className="benefit-item reveal" key={benefit}><span className="service-number">{number(index + 1)}</span><h3>{benefit}</h3></article>)}
          </div>
          <Link className="btn-link mt-8" to={routes[language].industries}>{labels.allIndustries}<ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>
      </section>
      <ClosingCTA language={language} />
    </>
  )
}

function About({ language }: { language: Language }) {
  const copy = content[language]
  const labels = ui[language]
  return (
    <>
      <PageHeading intro={{ eyebrow: copy.about.eyebrow, title: copy.about.title, description: copy.about.intro[0] }} index={2} />
      <section className="section-pad">
        <div className="container intro-grid reveal">
          <p className="eyebrow">{labels.purpose}</p>
          <div>{copy.about.intro.slice(1).map((paragraph, index) => <p className={index === 0 ? 'lead-copy mb-6' : 'body-copy'} key={paragraph}>{paragraph}</p>)}</div>
        </div>
      </section>
      <figure>
        <img className="image-band" src="/images/collaboration.jpg" alt={labels.imageAlt.collaboration} width="1920" height="1282" loading="lazy" />
        <figcaption className="container muted mt-3 text-[10px] tracking-wider">{labels.teamImageLabel}</figcaption>
      </figure>
      <section className="section-pad">
        <div className="container">
          <div className="intro-grid mb-14 reveal">
            <h2 className="section-title">{copy.about.teamTitle}</h2>
            <div>{copy.about.teamBody.map((paragraph) => <p className="body-copy" key={paragraph}>{paragraph}</p>)}</div>
          </div>
          <article className="founder-card reveal">
            <div className="founder-monogram" aria-hidden="true">LL</div>
            <div>
              <p className="eyebrow !mb-2">{labels.founderLabel}</p>
              <h3 className="text-3xl tracking-tight">{copy.about.founderName}</h3>
              <p className="mt-2 text-sm text-sand">{copy.about.founderRole}</p>
              <div className="mt-6 max-w-4xl">{copy.about.founderBio.map((paragraph) => <p className="body-copy" key={paragraph}>{paragraph}</p>)}</div>
            </div>
          </article>
        </div>
      </section>
      <section className="section-pad bg-navy">
        <div className="container intro-grid">
          <h2 className="section-title reveal">{copy.about.valuesTitle}</h2>
          <ul className="space-y-6">
            {copy.about.values.map((value) => <li className="reveal flex gap-4 border-b border-white/10 pb-6 text-lg leading-relaxed" key={value}><Check size={20} className="mt-1 text-sand" strokeWidth={1.4} aria-hidden="true" /><span>{value}</span></li>)}
          </ul>
        </div>
      </section>
      <ClosingCTA language={language} />
    </>
  )
}

function Services({ language }: { language: Language }) {
  const copy = content[language]
  const labels = ui[language]
  const location = useLocation()
  const listRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!location.hash) return
    let targetId: string
    try { targetId = decodeURIComponent(location.hash.slice(1)) } catch { return }
    const target = Array.from(listRef.current?.querySelectorAll('details') ?? []).find((element) => element.id === targetId)
    if (!target) return
    target.open = true
    const frame = requestAnimationFrame(() => target.scrollIntoView({ behavior: 'auto', block: 'start' }))
    return () => cancelAnimationFrame(frame)
  }, [location.hash])
  return (
    <>
      <PageHeading intro={copy.servicesIntro} index={3} />
      <section className="section-pad">
        <div className="container" ref={listRef}>
          {copy.services.map((service, index) => (
            <details className="service-detail reveal" id={service.id} key={service.id} open={index === 0}>
              <summary className="service-summary"><span className="service-number">{number(index + 1)}</span><h2>{service.title}</h2><ChevronDown size={22} strokeWidth={1.5} aria-hidden="true" /></summary>
              <div className="service-body">
                <div><p className="body-copy">{service.body}</p><a className="btn-link mt-4" href={contactHref(language, 'proposal', service.title)}>{labels.proposal}<ArrowUpRight size={16} aria-hidden="true" /></a></div>
                <ul className="service-items">{service.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            </details>
          ))}
        </div>
      </section>
      <section className="pb-16">
        <div className="container editorial-grid">
          <img className="editorial-photo !aspect-[16/10] reveal" src="/images/infrastructure.jpg" alt={labels.imageAlt.infrastructure} width="1200" height="673" loading="lazy" />
          <div className="reveal"><p className="eyebrow">{copy.approachIntro.eyebrow}</p><h2 className="section-title">{copy.approachIntro.title}</h2><p className="body-copy mt-6">{copy.approachIntro.description}</p><Link className="btn-link mt-5" to={routes[language].approach}>{labels.approachLink}<ArrowUpRight size={16} aria-hidden="true" /></Link></div>
        </div>
      </section>
      <ClosingCTA language={language} />
    </>
  )
}

function Industries({ language }: { language: Language }) {
  const copy = content[language]
  const labels = ui[language]
  const industryIcons = [Building2, Layers3, Target, HeartHandshake, GraduationCap, Network, Megaphone]
  return (
    <>
      <PageHeading intro={copy.industriesIntro} index={4} />
      <section className="section-pad">
        <div className="container industry-grid">
          {copy.industries.map((industry, index) => {
            const Icon = industryIcons[index]
            return (
              <article className="industry-card reveal" key={industry.id}>
                <Icon size={28} strokeWidth={1.3} aria-hidden="true" />
                <h2>{industry.title}</h2><p className="body-copy max-w-xl">{industry.body}</p>
                <p className="eyebrow !mt-7 !mb-3">{labels.related}</p>
                <div className="tag-list">
                  {industry.serviceIds.map((serviceId) => {
                    const service = copy.services.find((item) => item.id === serviceId)
                    return service ? <Link className="tag hover:border-sand/60 hover:text-ivory" key={serviceId} to={`${routes[language].services}#${serviceId}`}>{service.title}<ArrowUpRight size={12} className="ml-2" aria-hidden="true" /></Link> : null
                  })}
                </div>
              </article>
            )
          })}
        </div>
      </section>
      <div className="container pb-16"><Link className="btn btn-glass liquid-glass" to={routes[language].projects}>{labels.projects}<ArrowUpRight size={16} aria-hidden="true" /></Link></div>
      <ClosingCTA language={language} />
    </>
  )
}

function Approach({ language }: { language: Language }) {
  const copy = content[language]
  const labels = ui[language]
  return (
    <>
      <PageHeading intro={copy.approachIntro} index={5} />
      <section className="section-pad">
        <div className="container">
          <ol className="process-list">
            {copy.steps.map((step, index) => <li className="process-step reveal" key={step.title}><span className="service-number">{number(index + 1)}</span><h2>{step.title}</h2><p className="body-copy">{step.body}</p></li>)}
          </ol>
        </div>
      </section>
      <figure className="pb-16">
        <img className="image-band" src="/images/workspace.jpg" alt={labels.imageAlt.workspace} width="1200" height="801" loading="lazy" />
      </figure>
      <ClosingCTA language={language} />
    </>
  )
}

function Projects({ language }: { language: Language }) {
  const copy = content[language]
  const labels = ui[language]
  return (
    <>
      <PageHeading intro={copy.projectsIntro} index={6} />
      <section className="section-pad">
        <div className="container project-grid">
          {copy.projects.map((project) => (
            <article className="project-card reveal" key={project.id} id={project.id}>
              <div className="project-image-wrap">
                <img className="project-image" src={project.image} alt={project.imageAlt} loading="lazy" width="1200" height="750" />
                <span className="project-image-badge">{labels.mission}</span>
              </div>
              <div className="project-body">
                <p className="project-label">{project.sector}</p><h2 className="project-title">{project.title}</h2>
                <dl>
                  <dt className="eyebrow !mt-6 !mb-2">{labels.projectContext}</dt><dd className="body-copy">{project.context}</dd>
                  <dt className="eyebrow !mt-6 !mb-2">{labels.projectSupport}</dt><dd className="body-copy">{project.support}</dd>
                  <dt className="eyebrow !mt-6 !mb-2">{labels.deliverables}</dt>
                  <dd><ul className="project-deliverables !mt-0">{project.deliverables.map((item) => <li className="tag" key={item}>{item}</li>)}</ul></dd>
                </dl>
                <a className="btn-link mt-6" href={contactHref(language, 'project', project.title)}>{labels.discuss}<ArrowUpRight size={16} aria-hidden="true" /></a>
              </div>
            </article>
          ))}
        </div>
      </section>
      <ClosingCTA language={language} />
    </>
  )
}

function Contact({ language }: { language: Language }) {
  const copy = content[language]
  const labels = ui[language]
  const intents = [
    { id: 'consultation' as const, label: labels.consultation, description: labels.consultDescription, Icon: Compass },
    { id: 'proposal' as const, label: labels.proposal, description: labels.proposalDescription, Icon: Layers3 },
    { id: 'general' as const, label: labels.general, description: labels.generalDescription, Icon: Mail },
  ]
  return (
    <>
      <PageHeading intro={copy.contactIntro} index={7} />
      <section className="section-pad">
        <div className="container contact-grid">
          <div className="reveal">
            <p className="eyebrow">{labels.email}</p>
            <a className="contact-email inline-flex items-center gap-3" href={contactHref(language)}>contact@imperialdigitale.com<ArrowUpRight size={20} className="text-sand" aria-hidden="true" /></a>
            <div className="mt-8">
              <div className="contact-action"><MapPin size={22} strokeWidth={1.4} aria-hidden="true" /><div><h2 className="mb-1 text-sm">{labels.location}</h2><p className="body-copy">{copy.location}</p></div></div>
              <div className="contact-action"><Clock3 size={22} strokeWidth={1.4} aria-hidden="true" /><div><h2 className="mb-1 text-sm">{labels.availability}</h2><p className="body-copy">{copy.availability}</p></div></div>
            </div>
            <figure className="mt-10"><img className="editorial-photo !aspect-[16/10]" src="/images/city.jpg" alt={labels.imageAlt.city} width="1200" height="675" loading="lazy" /><figcaption className="muted mt-3 text-[10px] tracking-wider">{labels.teamImageLabel}</figcaption></figure>
          </div>
          <div className="contact-panel reveal">
            <p className="eyebrow">{labels.getInTouch}</p>
            <p className="lead-copy mb-5">{labels.contactNote}</p>
            {intents.map(({ id, label, description, Icon }) => (
              <a className="contact-action group" href={contactHref(language, id)} key={id}>
                <Icon size={22} strokeWidth={1.4} aria-hidden="true" />
                <div className="flex-1"><h2 className="text-base leading-snug group-hover:text-sand">{label}</h2><p className="muted mt-2 text-sm leading-relaxed">{description}</p></div>
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            ))}
            <p className="muted mt-7 text-xs leading-relaxed">{labels.emailNote}</p>
          </div>
        </div>
      </section>
    </>
  )
}

function NotFound({ language }: { language: Language }) {
  const labels = ui[language]
  return <section className="container error-page"><p className="eyebrow">{labels.errorEyebrow}</p><h1 className="page-title">{labels.errorTitle}</h1><p className="page-description">{labels.errorBody}</p><Link className="btn btn-primary mt-8" to={routes[language].home}>{labels.backHome}<ArrowRight size={17} aria-hidden="true" /></Link></section>
}

export function PageContent({ language, page }: { language: Language; page?: PageId }) {
  switch (page) {
    case 'home': return <Home language={language} />
    case 'about': return <About language={language} />
    case 'services': return <Services language={language} />
    case 'industries': return <Industries language={language} />
    case 'approach': return <Approach language={language} />
    case 'projects': return <Projects language={language} />
    case 'contact': return <Contact language={language} />
    default: return <NotFound language={language} />
  }
}
