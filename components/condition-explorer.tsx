"use client";

import { useState } from "react";
import { BrainCircuit, MessagesSquare, NotebookPen } from "lucide-react";

const conditions = [
  { name: "Conventional", icon: MessagesSquare, title: "An answer and an explanation", detail: "After recording an initial decision, the participant can request a direct answer from the AI, consider its explanation, and revise their response." },
  { name: "Metacognitive", icon: BrainCircuit, title: "A challenge to the initial reasoning", detail: "Before advice is shown, the participant describes their reasoning and uncertainty. The AI then introduces relevant counterarguments and evidence." },
  { name: "Structured reflection", icon: NotebookPen, title: "An explicit appraisal of the advice", detail: "After seeing the AI response, the participant records supporting evidence, a possible weakness, and an alternative explanation before revising their decision." },
];

export function ConditionExplorer() {
  const [selected, select] = useState(0);
  const condition = conditions[selected];
  return <section className="overview-section">
    <div className="section-heading"><h2>Experimental conditions</h2><span className="section-meta">Intervention design</span></div>
    <div className="condition-panel">
      <div className="condition-options" role="group" aria-label="Compare intervention conditions">
        {conditions.map(({name, icon: Icon}, index) => <button type="button" key={name} aria-pressed={selected === index} onClick={() => select(index)}><Icon size={16}/>{name}</button>)}
      </div>
      <div className="condition-copy" aria-live="polite"><h3>{condition.title}</h3><p>{condition.detail}</p></div>
    </div>
  </section>;
}
