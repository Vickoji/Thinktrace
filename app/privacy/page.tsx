import { ResearchGuide } from "@/components/research-guide";

export const metadata = { title: "Data & privacy" };

export default function PrivacyPage() {
  return <ResearchGuide title="Data & privacy" description="Account access and the safeguards required for a future participant study.">
    <section className="question-panel"><span className="tiny-caption">Current scope</span><h2>Creating an account is separate from joining a study.</h2><p>Supabase Authentication handles account credentials and sessions. Research participation requires its own approved consent process.</p></section>
    <section className="reading-section"><h2>Before a participant joins</h2><p>The study information sheet must name the investigator, explain random assignment and AI use, describe what will be stored, and specify withdrawal and retention dates. Participants must have an opportunity to ask questions and decline.</p></section>
    <section className="reading-section"><h2>Proposed data boundaries</h2><ul className="prose-list"><li>Limit study records to task responses, self-reported confidence, submitted reasoning, and specified task events.</li><li>Keep the identity linkage access-controlled and store study responses under a study-specific participant code.</li><li>Keep personal practice outside the research dataset. Use a reviewed export schema and check free text for identifying details before release.</li><li>Document how withdrawal affects linked records and when anonymization makes individual deletion impossible.</li></ul></section>
    <section className="reading-section"><h2>AI-assisted tasks</h2><p>Before deployment, disclose the model provider, data it receives, processing location, and retention terms. Restrict prompts to the minimum task content required by the approved protocol.</p></section>
  </ResearchGuide>;
}
