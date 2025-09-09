import Link from "next/link";

import { DYNAMIC_ROUTES } from "@/constants/routes";
import { getDeviconClassName } from "@/lib/utils";

import { Badge } from "../ui/badge";
type TagCardProps = {
  _id: string;
  name: string;
  questions: number;
  showCount?: boolean;
  compact?: boolean;
};

const TagCard = ({
  _id,
  name,
  questions,
  showCount,
  compact,
}: TagCardProps) => {
  const iconClass = getDeviconClassName(name);
  return (
    <Link href={DYNAMIC_ROUTES.TAG_CONTENT(_id)} className="flex-between gap-2">
      <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
        <div className="flex-center space-x-2">
          <i className={`${iconClass} text-sm`}></i>
          <span>{name}</span>
        </div>
      </Badge>
      {showCount && (
        <p className="small-medium text-dark500_light700">{questions}</p>
      )}
    </Link>
  );
};

export default TagCard;
