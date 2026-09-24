import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { content } from './content'
import { ui } from './ui'
import { contactHref, pageIds, rememberLanguage, routes, storedLanguage } from './navigation'
import { PageContent } from './pages'
import type { Language, PageId } from './types'
import { applyPageMetadata } from './seo'

function Brand({ language }: { language: Language }) {
  return <Link to={routes[language].home} className="brand-mark" aria-label={`${content[language].brand} — ${content[language].nav.home}`}>
    <img className="brand-image" src="/brand/logo.svg" alt={content[language].brand} width="293" height="278" />
  </Link>
}

function Header({ language, page }: { language: Language; page?: PageId }) {
  const copy = content[language]
  const t = ui[language]
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(() => window.scrollY > 20)
  const headerRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLButtonElement>(null)
  const location = useLocation()

  useEffect(() => { setOpen(false) }, [location.pathname])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    if (!open) return
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); menuRef.current?.focus() }
    }
    const outside = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const desktop = window.matchMedia('(min-width: 1280px)')
    const onResize = () => { if (desktop.matches) setOpen(false) }
    document.addEventListener('keydown', escape)
    document.addEventListener('pointerdown', outside)
    desktop.addEventListener('change', onResize)
    return () => {
      document.removeEventListener('keydown', escape)
      document.removeEventListener('pointerdown', outside)
      desktop.removeEventListener('change', onResize)
    }
  }, [open])

  return <header ref={headerRef} className={`site-header ${scrolled || open || page !== 'home' ? 'is-scrolled' : ''}`}>
    <div className="container header-inner">
      <Brand language={language} />
      <nav aria-label={t.mainNav} className="desktop-nav">
        {pageIds.map(id => <Link key={id} to={routes[language][id]} className={`nav-link ${id === page ? 'is-active' : ''}`} aria-current={id === page ? 'page' : undefined}>{copy.nav[id]}</Link>)}
      </nav>
      <div className="header-actions">
        <div className="language-toggle liquid-glass" role="group" aria-label={t.language}>
          {(['fr', 'en'] as const).map(lang => <Link key={lang} to={routes[lang][page ?? 'home']} className={language === lang ? 'is-active' : ''} aria-current={language === lang ? 'true' : undefined} aria-label={lang === 'fr' ? 'Français' : 'English'} lang={lang} onClick={() => rememberLanguage(lang)}>{lang.toUpperCase()}</Link>)}
        </div>
        <button ref={menuRef} type="button" className="menu-toggle liquid-glass" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? t.closeMenu : t.openMenu} onClick={() => setOpen(!open)}>
          <Menu size={19} className={`absolute transition-all duration-500 ${open ? 'rotate-180 scale-50 opacity-0' : 'rotate-0 opacity-100'}`} aria-hidden="true" />
          <X size={19} className={`absolute transition-all duration-500 ${open ? 'rotate-0 opacity-100' : '-rotate-180 scale-50 opacity-0'}`} aria-hidden="true" />
        </button>
      </div>
    </div>
    <div id="mobile-navigation" className={`mobile-nav ${open ? 'is-open' : ''}`} inert={!open} aria-hidden={!open}>
      <nav className="container" aria-label={t.mobileNav}>
        {pageIds.map((id, index) => <Link key={id} to={routes[language][id]} className={`mobile-link ${id === page ? 'is-active' : ''}`} aria-current={id === page ? 'page' : undefined} onClick={() => setOpen(false)} style={{ transitionDelay: `${open ? index * 35 : 0}ms` }}><span>{copy.nav[id]}</span><ArrowUpRight size={17} aria-hidden="true" /></Link>)}
        <a className="btn btn-primary mt-5" href={contactHref(language, 'consultation')}>{t.consultation}<ArrowUpRight size={16} aria-hidden="true" /></a>
      </nav>
    </div>
  </header>
}

function Footer({ language }: { language: Language }) {
  const copy = content[language]
  const t = ui[language]
  return <footer className="site-footer">
    <div className="container">
      <div className="footer-top">
        <div className="footer-brand"><Brand language={language} /><p className="body-copy muted mt-6 max-w-sm">{copy.footer.description}</p></div>
        <div><p className="eyebrow mb-5">{t.quickLinks}</p><nav className="footer-links" aria-label={`${t.quickLinks} — ${copy.brand}`}>{pageIds.map(id => <Link key={id} to={routes[language][id]}>{copy.nav[id]}</Link>)}</nav></div>
        <div><p className="eyebrow mb-5">{t.getInTouch}</p><a href={contactHref(language)} className="footer-email">contact@imperialdigitale.com<ArrowUpRight size={16} aria-hidden="true" /></a><p className="muted mt-5 text-sm">{copy.location}</p><p className="muted mt-2 text-sm">{copy.availability}</p></div>
      </div>
      <div className="footer-bottom"><p>© {new Date().getFullYear()} {copy.brand}. {t.allRights}</p><p>{t.footerSignature}</p></div>
    </div>
  </footer>
}

function Site({ language, page }: { language: Language; page?: PageId }) {
  const location = useLocation()
  const previousPath = useRef(location.pathname)
  const t = ui[language]

  useEffect(() => {
    rememberLanguage(language)
    applyPageMetadata(language, page)
    if (!location.hash) window.scrollTo({ top: 0, behavior: 'instant' })
    if (previousPath.current !== location.pathname) {
      document.getElementById('main-content')?.focus({ preventScroll: true })
      previousPath.current = location.pathname
    }
  }, [language, page, location.pathname, location.hash])

  useEffect(() => {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const elements = Array.from(document.querySelectorAll<HTMLElement>('main .reveal'))
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('reveal-pending')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.06 })
    elements.forEach(element => {
      if (element.getBoundingClientRect().top >= window.innerHeight) {
        element.classList.add('reveal-pending')
        observer.observe(element)
      }
    })
    return () => {
      observer.disconnect()
      elements.forEach(element => element.classList.remove('reveal-pending'))
    }
  }, [location.pathname])

  return <>
    <a href="#main-content" className="skip-link">{t.skip}</a>
    <Header language={language} page={page} />
    <main id="main-content" tabIndex={-1} key={location.pathname}>
      <PageContent language={language} page={page} />
    </main>
    <Footer language={language} />
  </>
}

function NotFound() {
  const { pathname } = useLocation()
  return <Site language={pathname.split('/')[1] === 'en' ? 'en' : 'fr'} />
}

export default function App() {
  return <BrowserRouter><Routes>
    <Route path="/" element={<Navigate to={routes[storedLanguage()].home} replace />} />
    {(['fr', 'en'] as const).flatMap(language => pageIds.map(page => <Route key={`${language}-${page}`} path={routes[language][page]} element={<Site language={language} page={page} />} />))}
    <Route path="*" element={<NotFound />} />
  </Routes></BrowserRouter>
}
