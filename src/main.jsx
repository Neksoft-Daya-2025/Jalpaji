import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ChevronDown, Mail, MapPin, Menu, Phone, X } from 'lucide-react';
import { pages, stylesheets } from './site-data.js';
import './styles.css';

const navItems = [
  { label: 'Home', href: '/' },
  {
    label: 'Services',
    href: '#',
    children: [
      { label: 'Agro-Commodities', href: '/agro-commodities/' },
      { label: 'Engineering & Industrial Services', href: '/engineering-industrial-services/' },
      { label: 'Construction', href: '/jalpaji-complex-2/' }
    ]
  },
  { label: 'Who Are We?', href: '/about-us/' },
  { label: 'Contact us', href: '/contact/' }
];

const footerItems = [
  { label: 'Home', href: '/' },
  { label: 'Who Are We?', href: '/about-us/' },
  { label: 'Privacy Policy', href: '/privacy-policy/' },
  { label: 'Contact us', href: '/contact/' }
];

function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

function Header() {
  const [open, setOpen] = useState(false);
  const current = normalizePath(window.location.pathname);

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="/" aria-label="Jalpaji home">
          <img src="/wp-content/uploads/2025/02/new-logo-4.svg" alt="Jalpaji" />
        </a>
        <button className="menu-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
        <nav className={`main-nav ${open ? 'open' : ''}`} aria-label="Primary navigation">
          {navItems.map((item) => (
            <div className={`nav-item ${item.children ? 'has-menu' : ''}`} key={item.label}>
              <a className={normalizePath(item.href) === current ? 'active' : ''} href={item.href}>
                {item.label}
                {item.children ? <ChevronDown size={16} strokeWidth={2.4} /> : null}
              </a>
              {item.children ? (
                <div className="dropdown">
                  {item.children.map((child) => (
                    <a key={child.href} href={child.href}>{child.label}</a>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-logo-col">
          <img src="/wp-content/uploads/2025/02/Japaji-logo-fullwhite.svg" alt="Jalpaji" />
          <div className="footer-address">
            <MapPin size={18} />
            <p><strong>Registered Office:</strong><br />Jalpaji Complex, Dadar<br />Kolhua, Muzaffarpur, Bihar<br />- 843108</p>
          </div>
          <div className="footer-address">
            <MapPin size={18} />
            <p><strong>Registered Office:</strong><br />10A, Lajpat Nagar-3, Next to Apollo<br />Pharmacy, Ground Floor, New Delhi<br />-110024</p>
          </div>
        </div>

        <div className="footer-links-col">
          <nav className="footer-main-nav" aria-label="Footer navigation">
            {footerItems.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
          </nav>
          <h3>Quick Links</h3>
          <a href="/agro-commodities/">Agro commodities</a>
          <a href="/engineering-industrial-services/">Engineering Services</a>
          <a href="/engineering-industrial-services/">Industrial Trading</a>
          <a href="/jalpaji-complex-2/">Construction</a>
          <a href="/our-registration-certificates/">Registration Certificates</a>
        </div>

        <div className="footer-contact-col">
          <a href="mailto:jalpabricks2014@gmail.com"><Mail size={18} />jalpabricks2014@gmail.com</a>
          <a href="mailto:Jalpajiconstructions@gmail.com"><Mail size={18} />Jalpajiconstructions@gmail.com</a>
          <a href="tel:+918827477988"><Phone size={18} />+91 882 747 7988</a>
          <a href="tel:+917280999055"><Phone size={18} />+91 728 099 9055</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 copyright by Jalapji | Managed by <a href="https://neksoftconsultancy.com/" target="_blank" rel="noreferrer">Nek</a><a href="https://nekdigital.nl/" target="_blank" rel="noreferrer">digital</a></p>
        <a href="/sitemap.xml">SiteMap</a>
      </div>
    </footer>
  );
}

function PageContent({ page }) {
  useEffect(() => {
    document.title = page?.title ? page.title.replace(' &#8211; ', ' - ') : 'Jalpaji';
  }, [page]);

  useEffect(() => {
    const root = document.querySelector('.page-shell');
    if (!root) return;

    root.querySelectorAll('img[data-src]').forEach((image) => {
      if (!image.getAttribute('src')) image.setAttribute('src', image.getAttribute('data-src'));
    });
    root.querySelectorAll('img[data-srcset]').forEach((image) => {
      image.setAttribute('srcset', image.getAttribute('data-srcset'));
    });
    root.querySelectorAll('[data-background-image]').forEach((element) => {
      if (!element.style.backgroundImage) {
        element.style.backgroundImage = `url(${element.getAttribute('data-background-image')})`;
      }
    });
  }, [page]);

  if (!page) {
    return (
      <main className="not-found">
        <h1>Page not found</h1>
        <a href="/">Go Home</a>
      </main>
    );
  }

  return (
    <main className={`page-shell page-${page.slug || 'home'}`}>
      <div dangerouslySetInnerHTML={{ __html: page.html }} />
    </main>
  );
}

function App() {
  const page = useMemo(() => {
    const path = normalizePath(window.location.pathname);
    return pages.find((item) => item.path === path) || pages.find((item) => item.path === '/');
  }, []);

  return (
    <>
      {stylesheets.map((href) => <link key={href} rel="stylesheet" href={href} />)}
      <Header />
      <PageContent page={page} />
      <Footer />
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
