import { FC } from "react";

interface ResultsCountProps {
  count: number;
}

const ResultsCount: FC<ResultsCountProps> = ({ count }: ResultsCountProps) => {
  return (
    <p className="">
      <span className="font-bold">
        {count} {count === 1 ? "post" : "posts"}
      </span>{" "}
      {count === 1 ? "was" : "were"} found.
    </p>
  );
};

export default ResultsCount;
