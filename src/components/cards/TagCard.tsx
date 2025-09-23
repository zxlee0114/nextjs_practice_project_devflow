import Image from "next/image";
import Link from "next/link";

import { DYNAMIC_ROUTES } from "@/constants/routes";
import { cn, getDeviconClassName, getTechDescription } from "@/lib/utils";

import { Badge } from "../ui/badge";

type TagCardProps = {
  _id: string;
  name: string;
  questionCount?: number;
  showCount?: boolean;
  isCompact?: boolean;
  isRemovable?: boolean;
  isButton?: boolean;
  handleRemove?: () => void;
};

const TagCard = ({
  _id,
  name,
  questionCount,
  showCount,
  isCompact,
  isRemovable,
  isButton,
  handleRemove,
}: TagCardProps) => {
  const iconClass = getDeviconClassName(name);
  const tagDescription = getTechDescription(name);

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
        <p className="small-medium text-dark500_light700">{questionCount}</p>
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

  return (
    <Link
      href={DYNAMIC_ROUTES.TAG_CONTENT(_id)}
      className="shadow-light100_darknone"
    >
      <article className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[250px]">
        <div className="flex items-center justify-between gap-3">
          <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
            <p className="paragraph-semibold text-dark300_light900">{name}</p>
          </div>
          <i className={cn(iconClass, "text-2xl")} aria-hidden="true" />
        </div>

        <p className="small-regular text-dark500_light700 mt-5 line-clamp-3 w-full">
          {tagDescription}
        </p>

        <p className="small-medium text-dark400_light500 mt-3.5">
          <span className="body-semibold primary-text-gradient mr-2.5">
            {questionCount}+
          </span>
          Questions
        </p>
      </article>
    </Link>
  );
};

export default TagCard;
