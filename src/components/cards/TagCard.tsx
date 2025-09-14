import Image from "next/image";
import Link from "next/link";

import { DYNAMIC_ROUTES } from "@/constants/routes";
import { getDeviconClassName } from "@/lib/utils";

import { Badge } from "../ui/badge";

type TagCardProps = {
  _id: string;
  name: string;
  questions?: number;
  showCount?: boolean;
  isCompact?: boolean;
  isRemovable?: boolean;
  isButton?: boolean;
  handleRemove?: () => void;
};

const TagCard = ({
  _id,
  name,
  questions,
  showCount,
  isCompact,
  isRemovable,
  isButton,
  handleRemove,
}: TagCardProps) => {
  const iconClass = getDeviconClassName(name);

  const BadgeContent = (
    <>
      <Badge className="subtle-medium background-light800_dark300 text-light400_light500 flex flex-row gap-2 rounded-md border-none px-4 py-2 uppercase">
        <div className="flex-center space-x-2">
          <i className={`${iconClass} text-sm`}></i>
          <span>{name}</span>
        </div>

        {isRemovable && (
          <Image
            src="/icons/close.svg"
            width={12}
            height={12}
            alt="close icon"
            className="cursor-pointer object-contain invert-0 dark:invert"
            onClick={handleRemove}
          />
        )}
      </Badge>

      {showCount && (
        <p className="small-medium text-dark500_light700">{questions}</p>
      )}
    </>
  );

  if (isCompact) {
    return isButton ? (
      <button type="button" className="flex-between gap-2">
        {BadgeContent}
      </button>
    ) : (
      <Link
        href={DYNAMIC_ROUTES.TAG_CONTENT(_id)}
        className="flex-between gap-2"
      >
        {BadgeContent}
      </Link>
    );
  }
};

export default TagCard;
