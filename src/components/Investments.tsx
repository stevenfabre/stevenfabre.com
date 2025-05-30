import Investment, { InvestmentProps } from "./Investment";

const INVESTMENTS: InvestmentProps[] = [
  {
    label: "Project Europe",
    url: "https://www.projecteurope.co/",
    description: "a fund investing in young European founders",
  },
  {
    label: "Klaro",
    url: "https://www.klaroapp.com/",
    description: "a user-friendly spreadsheet platform",
  },
  {
    label: "Plakar",
    url: "https://plakar.io/",
    description: "an open-source data backup solution",
  },
  {
    label: "Sequence",
    url: "https://sequence.film/",
    description: "a browser-based professional video editor",
  },
  {
    label: "Storytell.ai",
    url: "https://storytell.ai/",
    description: "an AI platform to extract signal from noise",
  },
  {
    label: "Guild",
    url: "https://guild.host/",
    description: "a community management platform",
  },
  {
    label: "Cursor Capital",
    url: "https://www.cursorcapital.vc/",
    description: "a venture firm focused on creative tools",
  },
  {
    label: "Dynamic Fund",
    url: "https://www.dynamicgrowth.partners/",
    description: "a fund investing in early stage technical Founders",
  },
  // {
  //   label: "Boldstart",
  //   url: "https://boldstart.vc/",
  //   description: "a venture firm investing in technical founders",
  // },
];

export default function () {
  return (
    <>
      <h2 className="font-semibold text-lg leading-relaxed mt-12 xl:mt-16 xl:text-xl xl:leading-relaxed text-neutral-900 dark:text-neutral-100">
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
