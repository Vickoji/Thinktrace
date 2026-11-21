"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronRight, FolderClosed, Menu, Microscope, X } from "lucide-react";
import { sections } from "./navigation";

function Brand() {
  return <Link href="/" className="brand" aria-label="ThinkTrace home">
    <span className="brand-mark" aria-hidden="true"><i/><i/><i/></span>
    ThinkTrace
  </Link>;
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const title = sections.find(item => item.href === path)?.label ??
    (path.startsWith("/auth") ? "Account access" : "My workspace");

  const closeMenu = () => setMenuOpen(false);
  return <div className="site-frame">
    <a href="#content" className="skip-link">Skip to content</a>
    <aside className={'sidebar' + (menuOpen ? ' is-open' : '')}>
      <div className="brand-row"><Brand/><button type="button" className="menu-button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="site-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button></div>
      <div id="site-navigation" className="sidebar-body">
        <nav onClick={closeMenu} aria-label="Main navigation">
          <p className="nav-caption">Research platform</p>
          {sections.map(({href, label, icon: Icon}) => <Link className="nav-item" aria-current={path === href ? "page" : undefined} key={href} href={href}><Icon size={17}/>{label}</Link>)}
          <div className="rail-divider"/>
          <p className="nav-caption">Personal</p>
          <Link href="/workspace" className="nav-item" aria-current={path === "/workspace" ? "page" : undefined}><FolderClosed size={17}/>My workspace</Link>
        </nav>
        <div className="sidebar-bottom">
          <span className="account-icon"><Microscope size={17}/></span>
          <Link href="/auth" onClick={closeMenu}>Account access <ArrowRight size={15}/></Link>
        </div>
      </div>
    </aside>
    <div className="content-area">
      <header className="top-bar"><div className="crumb"><span>Platform</span><ChevronRight size={13}/><strong>{title}</strong></div><Link href="/workspace" className="workspace-link">Open workspace <ArrowRight size={14}/></Link></header>
      <div id="content" tabIndex={-1}>{children}</div>
    </div>
  </div>;
}
