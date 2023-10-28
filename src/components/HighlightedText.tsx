import { FC } from "react";
import { nanoid } from "nanoid";

interface HighlightedTextProps {
  text: string;
  keywords: string;
}

const HighlightedText: FC<HighlightedTextProps> = ({
  text,
  keywords,
}: HighlightedTextProps) => {
  // If there are no keywords, return un-highlighted text
  if (!keywords || keywords.length === 0) return <span>{text}</span>;

  // Stores highlighted and non-highlighted text segments
  const parts = [];
  let currIndex = 0;

  const splitKeywords = keywords.split(" ");

  // Search through every keyword
  splitKeywords.forEach((keyword) => {
    // Get the index of the words
    const index = text.toLowerCase().indexOf(keyword.toLowerCase());

    if (index !== -1) {
      parts.push(text.substring(currIndex, index));

      currIndex = index + keyword.length;
    }

    // If the current word is in the keywords, wrap it in a highlighted element
    parts.push(
      // Setting key to a unique id to avoid duplicate keys when the item is not rendered on the page because of text truncation
      <span key={nanoid()} className="bg-yellow-500">
        {text.substring(index, currIndex)}
      </span>,
    );
  });

  parts.push(text.substring(currIndex));

  return <>{parts}</>;
};

export default HighlightedText;
