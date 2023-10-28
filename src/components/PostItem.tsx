import { format } from "date-fns";
import { FC } from "react";
import HighlightedText from "./HighlightedText";

interface PostItemProps {
  keywords?: string;
  title: string;
  createdAt: Date;
  content: string;
  slug: string;
}

const PostItem: FC<PostItemProps> = ({
  keywords = "",
  title,
  createdAt,
  content,
  slug,
}) => {
  return (
    <div className="border-neutral-300 py-8 [&:not(:last-child)]:border-b">
      <h1 className="text-2xl font-extrabold leading-10">
        <HighlightedText text={title} keywords={keywords} />
      </h1>
      <p className="font-medium italic text-neutral-800">
        {format(createdAt, "MMM dd, yyyy")}
      </p>
      <p className="post-preview-conainer pt-4 text-left font-medium leading-7">
        <HighlightedText text={content.substring(0, 300)} keywords={keywords} />
      </p>
    </div>
  );
};

export default PostItem;
