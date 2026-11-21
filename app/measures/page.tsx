import { ResearchGuide } from "@/components/research-guide";

export const metadata = { title: "Research measures" };
const measures = [
  ["Answer accuracy", "Use a preregistered scoring key for each objective item. Report initial and final proportions correct along with the number of scored responses."],
  ["Confidence calibration", "For questions that ask for the probability that the selected answer is correct, compare mean stated confidence with observed accuracy. Include the number of responses in each calibration bin."],
  ["Brier score", "For a probability p on the 0–1 scale and a binary outcome y, score each response as (p − y)² and average the scores. Lower scores indicate closer probability judgments. Apply only to eligible binary events."],
  ["Revision and reliance", "Revision is a change between initial and final answers. For items where the initial answer differs from identifiable AI advice, measure adoption as the share of eligible final answers matching that advice."],
  ["Response time", "Measure elapsed time between task presentation and submission. Time includes possible interruptions and is an observed duration."],
  ["Reasoning quality", "Score user-provided explanations against a versioned rubric for evidence use, counterarguments, and justification. Report rater agreement and missing ratings."],
];

export default function MeasuresPage() {
  return <ResearchGuide title="Research measures" description="Operational definitions for the proposed study and its analysis plan.">
    <section className="reading-section"><h2>Observable outcomes</h2><dl className="measure-list">{measures.map(([name, text]) => <div key={name}><dt>{name}</dt><dd>{text}</dd></div>)}</dl></section>
    <section className="reading-section"><h2>Group-level reporting</h2><p>Report group sizes, missing assessments, and interval estimates alongside point estimates. Account for repeated measurements within participants. Specify analysis decisions before reviewing group outcomes.</p></section>
  </ResearchGuide>;
}
