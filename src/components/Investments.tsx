import Investment, { InvestmentProps } from "./Investment";

const INVESTMENTS: InvestmentProps[] = [
  {
    label: "Fluidstack",
    url: "https://fluidstack.io/",
    description: "an AI cloud platform for frontier model training",
    stage: "TBA",
  },
  {
    label: "Decart",
    url: "https://decart.ai/",
    description: "a real-time AI lab for video and world models",
    stage: "Series B",
    tooltip: "$300m Series B led by Radical Ventures",
  },
  {
    label: "Klaro",
    url: "https://www.klaroapp.com/",
    description: "a user-friendly spreadsheet platform",
    stage: "Seed",
  },
  {
    label: "Plakar",
    url: "https://plakar.io/",
    description: "an open-source data backup solution",
    stage: "Seed",
  },
  {
    label: "Sequence",
    url: "https://sequence.film/",
    description: "a browser-based professional video editor",
    stage: "Seed",
  },
  {
    label: "Storytell.ai",
    url: "https://storytell.ai/",
    description: "an AI platform to extract signal from noise",
    stage: "Seed",
  },
  {
    label: "Guild",
    url: "https://guild.host/",
    description: "a community management platform",
    stage: "Seed",
  },
  {
    label: "Cursor Capital",
    url: "https://www.cursorcapital.vc/",
    description: "a venture firm focused on creative tools",
    stage: "Fund",
  },
  {
    label: "Dynamic Fund",
    url: "https://www.dynamicgrowth.partners/",
    description: "a fund investing in early stage technical Founders",
    stage: "Fund",
  },
  {
    label: "Boldstart",
    url: "https://boldstart.vc/",
    description: "a venture firm investing in technical founders",
    stage: "Fund",
  },
  {
    label: "Project Europe",
    url: "https://www.projecteurope.co/",
    description: "a fund investing in young European founders",
    stage: "Fund",
  },
  {
    label: "Seedcamp",
    url: "https://seedcamp.com/",
    description: "a fund backing early-stage European startups",
    stage: "Fund",
  },
];

export default function Investments() {
  return (
    <>
      <h2 className="font-semibold text-lg leading-relaxed mt-12 xl:mt-16 @xl/content:text-xl @xl/content:leading-relaxed text-neutral-900 dark:text-neutral-100">
        Investments
      </h2>
      <ul className="flex flex-col mt-4 xl:mt-6 gap-3">
        {INVESTMENTS.map((investment, index) => {
          return <Investment key={index} {...investment} />;
        })}
      </ul>
    </>
  );
}
