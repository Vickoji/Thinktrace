import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function ResearchGuide({ title, description, children }: {title: string; description: string; children: React.ReactNode}) {
  return <main className="page-content reading-page">
    <div className="page-heading"><h1>{title}</h1><p>{description}</p></div>
    <div className="reading-body">{children}</div>
    <Link className="back-link" href="/"><ArrowLeft size={15}/>Research overview</Link>
  </main>;
}
