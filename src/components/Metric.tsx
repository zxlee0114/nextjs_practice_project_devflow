import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type MetricProps = {
  imgUrl: string;
  alt: string;
  value: string | number;
  title: string;
  href?: string;
  textStyles?: string;
  imgStyles?: string;
  // isAuthor?: boolean;
  titleStyles?: string;
};

const Metric = ({
  imgUrl,
  alt,
  value,
  title,
  href,
  textStyles = "",
  imgStyles = "",
  // isAuthor = false,
  titleStyles,
}: MetricProps) => {
  const metricContent = (
    <>
      {imgUrl ? (
        <Image
          src={imgUrl}
          width={16}
          height={16}
          alt={alt}
          className={`aspect-square rounded-full object-cover ${imgStyles}`}
        />
      ) : (
        <User
          size={16}
          strokeWidth={2.5}
          className="dark:primary-gradient aspect-square rounded-full p-[1px]"
        />
      )}
      <p className={`${textStyles} flex items-center gap-1`}>
        {value}{" "}
        {title && (
          <span className={cn("small-regular line-clamp-1", titleStyles)}>
            {title}
          </span>
        )}
      </p>
    </>
  );
  return href ? (
    <Link href={href} className="flex-center gap-1">
      {metricContent}
    </Link>
  ) : (
    <div className="flex-center gap-1">{metricContent}</div>
  );
};

export default Metric;
