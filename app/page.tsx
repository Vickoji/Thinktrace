import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, ChartNoAxesCombined, FlaskConical, ShieldCheck } from "lucide-react";
import { ConditionExplorer } from "@/components/condition-explorer";
import { buttonVariants } from "@/components/ui/button";

const guides = [
  { href: "/protocol", title: "Study protocol", description: "Follow the path from baseline assessment to independent follow-up.", icon: BookOpen, color: "violet" },
  { href: "/measures", title: "Research measures", description: "Explore how accuracy, confidence, and decision revision are measured.", icon: ChartNoAxesCombined, color: "blue" },
  { href: "/privacy", title: "Data & privacy", description: "Review consent, participant withdrawal, and research data handling.", icon: ShieldCheck, color: "green" },
];

export default function OverviewPage() {
  return <main className="page-content">
    <div className="page-heading"><h1>Research overview</h1><p>Study design and methods for investigating human–AI reasoning.</p></div>
    <section className="study-hero" aria-labelledby="research-question">
      <div className="hero-art" role="presentation"/>
      <div className="hero-copy">
        <p className="hero-label"><FlaskConical size={13}/>Research question</p>
        <h2 id="research-question">How does AI shape<br/><em>human reasoning?</em></h2>
        <p className="hero-summary">Investigating how independent thought and structured reflection influence decisions made with AI.</p>
        <Link href="/protocol" className={buttonVariants({ variant: "light" })}>Explore the protocol <ArrowRight size={15}/></Link>
      </div>
    </section>
    <section className="overview-section">
      <div className="section-heading"><h2>Research guide</h2></div>
      <div className="guide-grid">
        {guides.map(({href, title, description, icon: Icon, color}) => <Link href={href} className="guide-card" key={href}>
          <div className="card-icon-row"><span className={'card-icon ' + color}><Icon size={20}/></span><ArrowUpRight className="card-arrow" size={17}/></div>
          <h3>{title}</h3><p>{description}</p>
        </Link>)}
      </div>
    </section>
    <ConditionExplorer/>
  </main>;
}
