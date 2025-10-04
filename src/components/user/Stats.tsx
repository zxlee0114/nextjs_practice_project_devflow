import Image from "next/image";

import { getUserStats } from "@/lib/actions/user.action";
import { formatNumber } from "@/lib/utils";

type StatsCardProps = {
  icon: string;
  value: number;
  title: string;
};

const StatsCard = ({ icon, value, title }: StatsCardProps) => {
  return (
    <div className="light-border background-light900_dark300 shadow-light-300 dark:shadow-dark-200 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6">
      <Image src={icon} alt={`${title} Icon`} width={40} height={50} />
      <div>
        <p className="paragraph-semibold text-dark200_light900">{value}</p>
        <p className="body-medium text-dark400_light700">{title}</p>
      </div>
    </div>
  );
};

type StatsProps = {
  userId: string;
  reputation: number | undefined;
};

const Stats = async ({ userId, reputation = 0 }: StatsProps) => {
  const result = await getUserStats({ userId });
  const { success } = result;
  if (!success) return null;
  const { totalQuestions, totalAnswers, badges } = result.data!;

  return (
    <div className="mt-10">
      <h4 className="h3-semibold text-dark200_light900">
        Stats{" "}
        <span className="small-semibold primary-text-gradient">
          {formatNumber(reputation)}
        </span>
      </h4>
      <div className="xs:grid-cols-2 mt-5 grid grid-cols-1 gap-5 md:grid-cols-4">
        <div className="light-border background-light900_dark300 shadow-light-300 dark:shadow-dark-200 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6">
          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {formatNumber(totalQuestions) || 0}
            </p>
            <p className="body-medium text-dark400_light700">Questions</p>
          </div>

          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {formatNumber(totalAnswers) || 0}
            </p>
            <p className="body-medium text-dark400_light700">Answers</p>
          </div>
        </div>

        <StatsCard
          icon="/icons/gold-medal.svg"
          value={badges ? badges.GOLD : 0}
          title="Gold Badges"
        />
        <StatsCard
          icon="/icons/silver-medal.svg"
          value={badges ? badges.SILVER : 0}
          title="Silver Badges"
        />
        <StatsCard
          icon="/icons/bronze-medal.svg"
          value={badges ? badges.BRONZE : 0}
          title="Bronze Badges"
        />
      </div>
    </div>
  );
};

export default Stats;
