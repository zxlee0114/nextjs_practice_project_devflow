import Image from "next/image";
import Link from "next/link";

type ProfileLinkProps = {
  title: string;
  icon: string;
  href?: string;
};
const ProfileLink = ({ title, icon, href }: ProfileLinkProps) => {
  return (
    <div className="flex-center gap-1">
      <Image src={icon} alt={title} width={20} height={20} />

      {href ? (
        <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="paragraph-medium text-link-100"
        >
          {title}
        </Link>
      ) : (
        <p className="paragraph-medium text-dark400_light700">{title}</p>
      )}
    </div>
  );
};

export default ProfileLink;
