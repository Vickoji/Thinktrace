import { ResearchGuide } from "@/components/research-guide";
import { ConditionExplorer } from "@/components/condition-explorer";

export const metadata = { title: "Study protocol" };
const stages = [
  ["Consent", "Explain the study purpose, procedures, data use, withdrawal process, and who to contact. Record the approved consent version before collecting research responses."],
  ["Independent baseline", "Present a pre-test without AI. Record each answer, explanation, confidence judgment, and submission time."],
  ["Assignment", "Randomly allocate the participant to an intervention condition. Counterbalance comparable task sets across assignment and assessment periods."],
  ["Assisted tasks", "Capture the initial decision before releasing the assigned intervention. Record the final answer, confidence, and reflection after assistance."],
  ["Independent post-test", "Compare performance on new, comparable tasks completed without AI. Where scheduled, repeat the independent assessment after a delay."],
];

export default function ProtocolPage() {
  return <ResearchGuide title="Study protocol" description="A draft protocol for comparing forms of AI assistance under controlled conditions.">
    <section className="question-panel"><span className="tiny-caption">Primary comparison</span><h2>Does examining uncertainty and counterevidence improve unaided reasoning?</h2><p>The primary comparison is unaided post-test accuracy after metacognitive or conventional assistance. Each group records an independent answer during training. Testing the effect of thinking first itself would require a separately approved immediate-AI comparison.</p></section>
    <section className="reading-section"><h2>Experimental sequence</h2><ol className="sequence-list">{stages.map(([title, copy]) => <li key={title}><h3>{title}</h3><p>{copy}</p></li>)}</ol></section>
    <ConditionExplorer/>
    <section className="reading-section"><h2>Before recruitment</h2><p>An academic supervisor and the appropriate institutional ethics committee must review the study design. Finalize task equivalence, recruitment, sample-size assumptions, retention intervals, and the analysis plan before collecting participant data.</p></section>
  </ResearchGuide>;
}
